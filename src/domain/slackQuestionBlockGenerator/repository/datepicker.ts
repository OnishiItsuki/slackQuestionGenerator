import {
  IDatepickerBlockElement,
  IDatepickerBlockParams,
} from "../models/datepicker";

export default (params: IDatepickerBlockParams): IDatepickerBlockElement => {
  return {
    ...params,
    type: "datepicker",
  };
};
