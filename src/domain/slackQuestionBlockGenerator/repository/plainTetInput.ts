import { IPlainTextInputBlockElement, IPlainTextInputParams } from "../models/plainTetInput";

export default (params: IPlainTextInputParams): IPlainTextInputBlockElement => {
  return {
    ...params,
    type: "plain_text_input",
  };
};
