export interface IDatepickerBlockParams {
  initial_date?: string;
  confirm?: Object;
}

export interface IDatepickerBlockElement extends IDatepickerBlockParams {
  type: "datepicker";
}
