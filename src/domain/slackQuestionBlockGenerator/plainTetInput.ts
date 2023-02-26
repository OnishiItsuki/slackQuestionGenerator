import { QuestionBlockPropsBase } from "./models";

export interface IPlainTextInputParams extends QuestionBlockPropsBase{
  initial_value?: string;
  multiline?: Boolean;
  min_length?: number;
  max_length?: number;
  dispatch_action_config?: Object;
}

export interface IPlainTextInputBlockElement extends IPlainTextInputParams {
  type: "plain_text_input";
}

export default (params: IPlainTextInputParams): IPlainTextInputBlockElement => {
  return {
    ...params,
    type: "plain_text_input",
  };
};
