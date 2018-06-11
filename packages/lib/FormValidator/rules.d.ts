export declare type ValidatorRules = ValidateBase | ValidateNumber | ValidateString | ValidateEqual;
export interface ValidateBase {
    required?: boolean;
}
export interface ValidateNumber {
    min?: number;
    max?: number;
}
export interface ValidateString {
    minlen?: number;
    maxlen?: number;
    email?: boolean;
    url?: boolean;
    date?: boolean;
    number?: boolean;
    tel?: boolean;
    min?: boolean;
    max?: boolean;
}
export interface ValidateEqual {
    equal?: number | string;
}
export declare type ValidatorFunctions = {
    [key in keyof ValidatorRules]: Function;
};
declare const rules: ValidatorFunctions;
export default rules;
