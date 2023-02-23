import {
  INumberInputBlockElement,
  INumberInputBlockParams,
} from "../models/numberInput";

export default (params: INumberInputBlockParams): INumberInputBlockElement => {
  return {
    ...params,
    type: "number_input",
  };
};
