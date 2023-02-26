import { IPlainTextInputParams } from "./plainTetInput";
import { INumberInputBlockParams } from "./numberInput";
import { IStaticSelectQuestionBlockParams } from "./staticSelect";
import { IDatepickerBlockParams } from "./datepicker";

export interface QuestionBlockPropsBase {
  block_id: string;
  label: string;
  optional?: boolean;
}

export type BlockTypes =
  | "plain_text_input"
  | "number_input"
  | "static_select"
  | "datepicker";

export type GenerateBlockParams<T extends BlockTypes> =
  T extends "static_select"
    ? IStaticSelectQuestionBlockParams
    : T extends "plain_text_input"
    ? IPlainTextInputParams
    : T extends "number_input"
    ? INumberInputBlockParams
    : T extends "datepicker"
    ? IDatepickerBlockParams
    : void;

export type GenerateBlockConfig<T extends BlockTypes> = {
  blockType: T;
  params: GenerateBlockParams<T>;
};

export type SlackQuestionBlock = {
  type: "input";
  label: {
    type: "plain_text";
    text: string;
  };
  element: Record<string, any>;
  dispatch_action?: boolean;
  block_id?: string;
  hint?: string;
  optional?: boolean;
};
