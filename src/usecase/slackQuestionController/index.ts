import SlackPostQuestionService from "../../domain/slackPostQuestionService";
import {
  BlockTypes,
  GenerateBlockConfig,
  GenerateBlockParams,
} from "../../domain/slackQuestionBlockGenerator/models";
import SlackQuestionBlockGenerator from "../../domain/slackQuestionBlockGenerator";

type Payload = Record<string, any>;

export default class SlackQuestionController {
  private _isOpenModal: boolean = false;
  public OPEN_MODAL_URL: string = "https://slack.com/api/views.open";

  private _questionTitle: string = "";
  private _questionBlockConfigList: GenerateBlockConfig<BlockTypes>[] = [];

  private _slackPostService: SlackPostQuestionService;
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

    this._parsePayload(payload || {});
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

    this._slackPostService.post(params);

    this._isOpenModal = true;
    return ContentService.createTextOutput();
  }
}

const main = () => {
  const o = new SlackQuestionController({
    payload: {},
    slackToken: "",
    slackPostUrl: "",
  });

  const IS_DEBUGGING = false;
  o.setQuestionBlocks(
    [
    {
      blockType: "static_select",
      params: {
        block_id: "service",
        label: "サービス",
        optional: IS_DEBUGGING,
        options: [
          {
            label: "aircloset",
            value: "aircloset",
          },
          {
            label: "fitting",
            value: "fitting",
          },
          {
            label: "bridge",
            value: "bridge",
          },
          {
            label: "mall",
            value: "mall",
          },
        ],
      },
    },

    {
      blockType: "static_select",
      params: {
        block_id: "operation_type",
        label: "依頼項目",
        optional: IS_DEBUGGING,
        options: [
          {
            label: "調査依頼",
            value: "search",
          },
          {
            label: "データ修正依頼",
            value: "data_modify",
          },
          {
            label: "SQLレビュー依頼",
            value: "sql_review",
          },
        ],
      },
    },

    {
      blockType: "plain_text_input",
      params: {
        block_id: "request_background",
        label: "背景",
        optional: IS_DEBUGGING,
        multiline: true,
      },
    },

    {
      blockType: "plain_text_input",
      params: {
        block_id: "request_detail",
        optional: IS_DEBUGGING,
        multiline: true,
        label: "依頼内容",
      },
    },

    {
      blockType: "number_input",
      params: {
        block_id: "user_id",
        label: "ユーザーID",
        optional: IS_DEBUGGING,
        is_decimal_allowed: true,
        min_value: "0",
      },
    },

    {
      blockType: "number_input",
      params: {
        block_id: "order_id",
        label: "オーダーID",
        optional: true,
        is_decimal_allowed: true,
        min_value: "0",
      },
    },

    {
      blockType: "static_select",
      params: {
        block_id: "severity_type",
        label: "緊急度",
        optional: IS_DEBUGGING,
        options: [
          {
            label: "当日必須",
            value: "in_today",
          },
          {
            label: "3日以内",
            value: "in_three_days",
          },
          {
            label: "7日以内",
            value: "in_seven_days",
          },
          {
            label: "1週間以上",
            value: "over_one_week",
          },
        ],
      },
    },

    {
      blockType: "datepicker",
      params: {
        label: "対応期限",
        block_id: "limit_date",
        optional: IS_DEBUGGING,
      },
    },
  ]
  
  );
};
