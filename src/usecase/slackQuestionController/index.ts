import {SlackPostQuestionService} from "../../domain/slackPostQuestionService";
import {
  BlockTypes,
  GenerateBlockConfig,
  GenerateBlockParams,
} from "../../domain/slackQuestionBlockGenerator/models";
import {SlackQuestionBlockGenerator} from "../../domain/slackQuestionBlockGenerator";

type Payload = Record<string, any>;

class SlackQuestionController {
  private _isOpenModal: boolean = false;
  public OPEN_MODAL_URL: string = "https://slack.com/api/views.open";
  private _SLACK_TOKEN: string;
  private _TRIGGER_ID: string;

  private _questionTitle: string = "";
  private _questionBlockConfigList: GenerateBlockConfig<BlockTypes>[] = [];
  private _slackQuestionBlockGenerator: SlackQuestionBlockGenerator;
  private _result: null | Record<string, string> = null;

  private _throwError(message: string): never {
    throw new Error(`SlackQuestionController Error: ${message}`);
  }

  private _createActionId(blockId: string): string {
    return `${blockId}_id`;
  }

  private _getValueFromObj = (
    obj: Record<string, any>,
    valueName: string
  ): string => {
    const actionId = this._createActionId(valueName);
    const valueObj = obj.view.state.values[valueName][actionId];

    switch (valueObj.type) {
      case "static_select":
        return valueObj?.selected_option.value;
      case "plain_text_input":
        return valueObj.value;
      case "number_input":
        return valueObj.value;
      case "datepicker":
        return valueObj.value;
      default:
        throw new Error("unexpected vale type: ", valueObj.type);
    }
  };

  private _parsePayload(payload: Payload): void {
    if (payload?.parameter?.parameter?.payload) {
      const valueObjects = JSON.parse(
        decodeURIComponent(payload.parameter.parameter.payload)
      );

      const result: Record<string, string> = {};
      Object.keys(valueObjects).map((key) => {
        result[key] = this._getValueFromObj(valueObjects, key);
      });
      this._result = result;
    }
    this._result = null;
  }

  constructor({ payload, slackToken }: { payload: any; slackToken: string }) {
    if (!payload?.trigger_id) {
      this._throwError(
        `payload.trigger_id is not defined: ${JSON.stringify(payload)}`
      );
    }

    this._TRIGGER_ID = payload.trigger_id;
    this._SLACK_TOKEN = slackToken;
    this._slackQuestionBlockGenerator = new SlackQuestionBlockGenerator(
      this._createActionId
    );

    this._parsePayload(payload || {});
  }

  private _checkOpenModal(): void | never {
    if (this._isOpenModal) {
      this._throwError(
        "main thread is not returned after openModal method already have been executed."
      );
    }
  }

  set questionTitle(title: string) {
    this._checkOpenModal();
    this._questionTitle = title;
  }

  get questionTitle(): string {
    return this._questionTitle;
  }

  get questionBlockGenerator(): SlackQuestionBlockGenerator {
    return this._slackQuestionBlockGenerator;
  }

  public setQuestionBlocks<T extends BlockTypes>(
    configs: {
      blockType: T;
      params: GenerateBlockParams<T>;
    }[]
  ) {
    this._checkOpenModal();
    this._questionBlockConfigList = configs;
  }

  get questionBlocks(): GenerateBlockConfig<BlockTypes>[] {
    return this._questionBlockConfigList;
  }

  get result(): null | Record<string, string> {
    return this._result;
  }

  public openModal() {
    this._checkOpenModal();

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

    const params = this._slackQuestionBlockGenerator.generate(
      this._questionTitle,
      this._questionBlockConfigList
    );

    const slackPostService = new SlackPostQuestionService({
      token: this._SLACK_TOKEN,
      triggerId: this._TRIGGER_ID,
      postUrl: this.OPEN_MODAL_URL,
    });
    slackPostService.post(params);

    this._isOpenModal = true;

    return ContentService.createTextOutput();
  }
}

export default SlackQuestionController;
