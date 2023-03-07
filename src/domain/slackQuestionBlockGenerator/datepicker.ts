import { QuestionBlockPropsBase } from "./models";

export interface IDatepickerBlockParams extends QuestionBlockPropsBase {
  initial_date?: string;
  confirm?: Object;
}

export interface IDatepickerBlockElement extends IDatepickerBlockParams {
  type: "datepicker";
}

const createDatepickerBlock = (params: IDatepickerBlockParams): IDatepickerBlockElement => {
  return {
    ...params,
    type: "datepicker",
  };
};

export {createDatepickerBlock};
