import {
  IBlockTypes,
  GenerateBlockConfig,
  QuestionBlockPropsBase,
  IGenerateBlockConfig,
} from "../models";
import datepicker from "./datepicker";
import numberInput from "./numberInput";
import plainTetInput from "./plainTetInput";
import staticSelect from "./staticSelect";

type ActionTypeFormatter = (actionType: string) => string;
type SlackQuestionBlock = Record<string, any>;

class SlackQuestionBlockGenerator {
  private _actionTypeFormatter: ActionTypeFormatter;
  private BLOCK_TYPES: Array<IBlockTypes> = [
    "plain_text_input",
    "number_input",
    "static_select",
    "datepicker",
  ];

  private _throwError(message: string): never {
    throw new Error(`SlackQuestionBlockGenerator Error: ${message}`);
  }

  constructor(actionTypeFormatter: ActionTypeFormatter) {
    this._actionTypeFormatter = actionTypeFormatter;
  }

  private _generateQuestionBlock(
    props: QuestionBlockPropsBase,
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

  public generateBlock(
    props: IGenerateBlockConfig
  ): Boolean | SlackQuestionBlock {
    let element: Record<string, any>;
    switch (props.blockType) {
      case "plain_text_input":
        element = plainTetInput(props.config);
      case "number_input":
        element = numberInput(props.config);
      case "static_select":
        // TODO
        element = staticSelect(props.config as any);
      case "datepicker":
        element = datepicker(props.config);
      default:
        return this._throwError(`unexpected blockType: ${props.blockType}`);
    }

    // TODO
    return this._generateQuestionBlock(props.config as any, element);
  }
}

export default SlackQuestionBlockGenerator;
