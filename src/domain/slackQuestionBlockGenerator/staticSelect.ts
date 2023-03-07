import { QuestionBlockPropsBase } from "./models";

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

const _generateSelectOptions = (
  optionList: GenerateSelectOptionInput[]
): GenerateSelectOptionOutput[] => {
  return optionList.map((option) => {
    return {
      text: {
        type: "plain_text",
        text: option.label,
      },
      value: option.value,
    };
  });
};

export interface IStaticSelectQuestionBlockParams
  extends QuestionBlockPropsBase {
  options: GenerateSelectOptionInput[];
}

export interface IStaticSelectQuestionBlockElement
  extends QuestionBlockPropsBase {
  type: "static_select";
  options: GenerateSelectOptionOutput[];
}

const createStaticSelectBlock = (
  config: IStaticSelectQuestionBlockParams
): IStaticSelectQuestionBlockElement => {
  const tmp = _generateSelectOptions(config.options);
  return {
    ...config,
    type: "static_select",
    options: tmp,
  };
};

export {createStaticSelectBlock};
