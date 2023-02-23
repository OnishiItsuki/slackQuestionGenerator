import * as config from "../../config/slack";
import SlackPostQuestionService from "../../domain/slackPostQuestionService/repository";
import { IGenerateBlockConfig } from "../../domain/slackQuestionBlockGenerator/models";
import SlackQuestionBlockGenerator from "../../domain/slackQuestionBlockGenerator/repository";

type QuestionBlock = Record<string, any>;

export default class SlackQuestionController {
  private _isOpenModal: boolean = false;

  public SUBMIT_LABEL: string = "確定";
  public CLOSE_LABEL: string = "キャンセル";
  public OPEN_MODAL_URL: string = config.POST_OPEN_MODAL_URL;

  private _questionTitle: string = "";
  private _questionBlockConfigList: QuestionBlock[] = [];

  private _slackPostService: SlackPostQuestionService;
  private _slackQuestionBlockGenerator: SlackQuestionBlockGenerator;

  private _result: null | Record<string, string> = null;

  private _throwError(message: string): never {
    throw new Error(`SlackQuestionController Error: ${message}`);
  }

  private _createActionId(blockId: string): string {
    return `${blockId}_id`;
  }

  private _parsePayload4Result(payload: any): void {
    if (payload?.parameter?.parameter?.payload) {
      const obj = payload.parameter.parameter.payload;
      this._result = { ...obj };
    }
    this._result = null;
  }

  constructor({
    payload,
    slackToken,
    slackPostUrl,
  }: {
    payload: any;
    slackToken: string;
    slackPostUrl: string;
  }) {
    this._slackPostService = new SlackPostQuestionService({
      token: slackToken,
      triggerId: payload?.trigger_id,
      postUrl: slackPostUrl,
    });
    this._slackQuestionBlockGenerator = new SlackQuestionBlockGenerator(
      this._createActionId
    );

    this._parsePayload4Result(payload);
  }

  private _checkOpenModal(): void | never {
    if (this._isOpenModal) {
      this._throwError(
        "main thread is not returned after openModal method already have been executed."
      );
    }
  }

  set title(title: string) {
    this._checkOpenModal();
    this._questionTitle = title;
  }

  get title(): string {
    return this._questionTitle;
  }

  public setQuestionBlocks<T>(configs: IGenerateBlockConfig[]) {
    this._checkOpenModal();
    this._questionBlockConfigList = configs;
  }

  get questionBlocks(): QuestionBlock[] {
    return this._questionBlockConfigList;
  }

  get result(): null | Record<string, string> {
    return this._result;
  }

  private _generateQuestionView() {
    if (!this._questionTitle) {
      this._throwError(`unexpected title: ${this._questionTitle}`);
    }

    if (
      !this._questionBlockConfigList ||
      !Array.isArray(this._questionBlockConfigList)
    ) {
      this._throwError(
        `unexpected questionBlocks: ${this._questionBlockConfigList}`
      );
    }

    const questionBlocks = this._questionBlockConfigList.map((config) =>
      // TODO
      this._slackQuestionBlockGenerator.generateBlock(config as any)
    );

    const block = {
      type: "modal",
      title: {
        type: "plain_text",
        text: this._questionTitle,
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: this.SUBMIT_LABEL,
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: this.CLOSE_LABEL,
        emoji: true,
      },
      blocks: questionBlocks,
    };

    return JSON.stringify(block);
  }

  public openModal() {
    this._checkOpenModal();

    const params = this._generateQuestionView();
    this._slackPostService.post(params);

    this._isOpenModal = true;
    return ContentService.createTextOutput();
  }
}
