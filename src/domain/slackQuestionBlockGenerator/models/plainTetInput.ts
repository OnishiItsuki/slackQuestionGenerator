export interface IPlainTextInputParams {
  initial_value?: string;
  multiline?: Boolean;
  min_length?: number;
  max_length?: number;
  dispatch_action_config?: Object;
}

export interface IPlainTextInputBlockElement extends IPlainTextInputParams {
  type: "plain_text_input";
}
