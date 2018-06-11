import * as EmailValidator from 'email-validator';
// import {isValidNumber} from 'libphonenumber-js';

export type ValidatorRules = ValidateBase | ValidateNumber | ValidateString | ValidateEqual;

// ------------------------------------------------------------------ Validators
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

export type ValidatorFunctions = {
    [key in keyof ValidatorRules]: Function
};

type ValidatorReturn = string | void;

const rules: ValidatorFunctions = {
    required(val: any, required: boolean): ValidatorReturn {
        if (!Boolean(val) && required) return 'This field is required';
    },

    maxlen(val: any, maxSize: number): ValidatorReturn {
        if (val.length > maxSize) return `This field has a maximum size of ${maxSize}`;
    },

    minlen(val: any, minSize: number): ValidatorReturn {
        if (val.length < minSize) return `This field has a minimum size of ${minSize}`;
    },

    number(val: any, required: boolean): ValidatorReturn {
        if (!(/^[0-9]+$/).test(val) && required) return 'This field should be a number';
    },

    min(val: any, min: number): ValidatorReturn {
        if (Number(val) < min) return `This field should be above ${min}`;
    },

    max(val: any, max: number): ValidatorReturn {
        if (Number(val) < max) return `This field should be below ${max}`;
    },

    tel(val: any, required: boolean): ValidatorReturn {
        // TODO: Phone number checking
        if (required) return 'NO';
        // if (!isValidNumber (val)) return 'This field should be a telephone number';
    },

    email(val: string, required: boolean): ValidatorReturn {
        if (!EmailValidator.validate(val)) return 'Invalid email';
    }
};

export default rules;
