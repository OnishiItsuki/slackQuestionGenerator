import {
  BlockTypes,
  GenerateBlockConfig,
  GenerateBlockParams,
  SlackQuestionBlock,
} from "./models";
import {createDatepickerBlock} from "./datepicker";
import {createNumberInputBlock} from "./numberInput";
import {createPlainTextBlock} from "./plainTetInput";
import {createStaticSelectBlock, IStaticSelectQuestionBlockParams} from "./staticSelect";

type ActionTypeFormatter = (actionType: string) => string;

class SlackQuestionBlockGenerator {
  public SUBMIT_LABEL: string = "submit";
  public CLOSE_LABEL: string = "cancel";

  private _actionTypeFormatter: ActionTypeFormatter;

  private _throwError(message: string): never {
    throw new Error(`SlackQuestionBlockGenerator Error: ${message}`);
  }

  constructor(actionTypeFormatter: ActionTypeFormatter) {
    this._actionTypeFormatter = actionTypeFormatter;
  }

  private _generateQuestionBlock(
    props: GenerateBlockParams<BlockTypes>,
    element: Record<string, any>
  ): SlackQuestionBlock {
    return {
      block_id: props.block_id,
      type: "input",
      optional: props.optional ?? true,
      element: {
        ...element,
        action_id: this._actionTypeFormatter(props.block_id),
      },
      label: {
        type: "plain_text",
        text: props.label,
      },
    };
  }

  private _generateBlock<T extends BlockTypes>(props: {
    blockType: T;
    params: GenerateBlockParams<T>;
  }): Boolean | SlackQuestionBlock {
    let element: Record<string, any>;

    switch (props.blockType) {
      case "plain_text_input":
        element = createPlainTextBlock(props.params);
        break;
      case "number_input":
        element = createNumberInputBlock(props.params);
        break;
      case "static_select":
        element = createStaticSelectBlock(
          props.params as IStaticSelectQuestionBlockParams
        );
        break;
      case "datepicker":
        element = createDatepickerBlock(props.params);
        break;
      default:
        return this._throwError(`unexpected blockType: ${props.blockType}`);
    }
    return this._generateQuestionBlock(props.params, element);
  }

  public generate(
    title: string,
    configList: GenerateBlockConfig<BlockTypes>[]
  ) {
    const questionBlocks = configList.map((config) =>
      this._generateBlock(config)
    );

    const block = {
      type: "modal",
      title: {
        type: "plain_text",
        text: title,
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
}

export {SlackQuestionBlockGenerator};
