export type GenerateSelectOptionInput = {
  label: string;
  value: string;
};

export type GenerateSelectOptionOutput = {
  text: {
    type: "plain_text";
    text: string;
  };
  value: string;
};

export interface IStaticSelectQuestionBlockParams {
  // TODO
  options: Record<string, any>;
  // options: GenerateSelectOptionInput[];
}

export interface IStaticSelectQuestionBlockElement
  extends IStaticSelectQuestionBlockParams {
  type: "static_select";
}
