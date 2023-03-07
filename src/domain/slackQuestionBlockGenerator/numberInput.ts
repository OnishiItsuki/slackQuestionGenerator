import { QuestionBlockPropsBase } from "./models";

export interface INumberInputBlockParams extends QuestionBlockPropsBase{
  is_decimal_allowed?: Boolean;
  initial_value?: string;
  min_value?: string;
  max_value?: string;
  dispatch_action_config?: Object;
}

export interface INumberInputBlockElement extends INumberInputBlockParams {
  type: "number_input";
}

const createNumberInputBlock = (params: INumberInputBlockParams): INumberInputBlockElement => {
  return {
    ...params,
    type: "number_input",
  };
};

export {createNumberInputBlock};
