// import {isValidNumber} from 'libphonenumber-js';

export type ValidatorRuleNames =
    'required' |
    'maxlen' |
    'minlen' |
    'number' |
    'tel';

export type ValidatorRulesValid = { [key in ValidatorRuleNames]: any };

export interface ValidatorRules {
    required?: boolean;
    maxlen?: number;
    minlen?: number;
    number?: boolean;
    tel?: boolean;
}

const rules: ValidatorRulesValid = {
    required(val: any): string | void {
        if (!val && val !== false && val !== 0) return 'This field is required';
    },

    maxlen(val: any, maxSize: number): string | void {
        if (val.length > maxSize) return `This field has a maximum size of ${maxSize}`;
    },

    minlen(val: any, minSize: number): string | void {
        if (val.length < minSize) return `This field has a minimum size of ${minSize}`;
    },

    number(val: any): string | void {
        if (!(/^[0-9]+$/).test(val)) return 'This field should be a number';
    },

    tel(val: any): string | void {
        // TODO: Phone number checking
        return 'NO';
        // if (!isValidNumber (val)) return 'This field should be a telephone number';
    }
};

export default rules;
