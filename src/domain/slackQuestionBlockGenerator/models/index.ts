import { IPlainTextInputParams } from "./plainTetInput";
import { INumberInputBlockParams } from "./numberInput";
import { IStaticSelectQuestionBlockParams } from "./staticSelect";
import { IDatepickerBlockParams } from "./datepicker";

export type IBlockTypes = "plain_text_input" | "number_input" | "static_select" | "datepicker";

export interface QuestionBlockPropsBase {
  block_id: string;
  label: string;
  optional?: boolean;
}

// TODO
export type GenerateBlockConfig = Record<string, any>;
// export type GenerateBlockConfig<T extends IBlockTypes> =
//   QuestionBlockPropsBase &
//     (T extends "plain_text_input"
//       ? IPlainTextInputParams
//       : T extends "number_input"
//       ? INumberInputParams
//       : T extends "static_select"
//       ? IStaticSelectQuestionBlockParams
//       : T extends "datepicker"
//       ? IDatepickerBlockParams
//       : void);

export type IGenerateBlockConfig = {
  blockType: IBlockTypes;
  config: GenerateBlockConfig;
};
