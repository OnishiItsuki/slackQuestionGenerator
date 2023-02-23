import {
  IStaticSelectQuestionBlockParams,
  GenerateSelectOptionInput,
  GenerateSelectOptionOutput,
  IStaticSelectQuestionBlockElement,
} from "../models/staticSelect";

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

export default (
  config: IStaticSelectQuestionBlockParams
): IStaticSelectQuestionBlockElement => {
  return {
    type: "static_select",
    // TODO
    options: _generateSelectOptions(config.options as any[]),
  };
};
