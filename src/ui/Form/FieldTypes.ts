import {ValidatorRules, ValidateBase, ValidateString, ValidateEqual} from './Validator/rules';


export type Field = FieldDefault | FieldSelect | FieldCheckbox | FieldSubmit | FieldRadioIcons;


// ------------------------------------------------------------------------ Base
export interface FieldBase {
    name: string;
    value?: any;
    color?: string;

    required?: boolean;
    disabled?: boolean;
    validate?: ValidateBase;
}


// ------------------------------------------------------------- Mixins / Addons
export interface FieldMixinIcon {
    icon?: string;
    iconColor?: string;
}

export interface FieldMixinPlaceholder {
    placeholder?: string;
}


// ---------------------------------------------------------------------- Fields
export interface FieldDefaultValidation extends ValidateBase, ValidateString, ValidateEqual {}
export interface FieldDefault extends FieldBase, FieldMixinPlaceholder, FieldMixinIcon {
    type: 'text' | 'textarea' | 'input' | 'password' | 'email' | 'date' | 'number';
    validate?: FieldDefaultValidation;
}


export interface FieldSelect extends FieldBase, FieldMixinPlaceholder {
    type: 'select';
    options?: {
        [key: string]: string
    };
}


export interface FieldCheckbox extends FieldBase {
    type: 'checkbox';
    label?: 'string';
}


export interface FieldSubmit extends FieldBase, FieldMixinIcon {
    type: 'submit';
}

export interface FieldRadioIconsOption {
    value: number | string;
    label?: number | string;
    icon?: string;
    image?: string;
    html?: string;
}
export interface FieldRadioIcons extends FieldBase {
    type: 'radio-icons';
    options?: FieldRadioIconsOption[];
}
