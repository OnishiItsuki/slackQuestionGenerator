export interface INumberInputBlockParams {
  is_decimal_allowed?: Boolean;
  initial_value?: string;
  min_value?: string;
  max_value?: string;
  dispatch_action_config?: Object
}

export interface INumberInputBlockElement extends INumberInputBlockParams {
  type: "number_input";
}
