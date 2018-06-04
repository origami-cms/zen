import {ValidatorRules, ValidateBase, ValidateString, ValidateEqual} from './rules';

export type Field =
    FieldDefault |
    FieldSelect |
    FieldCheckbox |
    FieldSubmit |
    FieldRadio |
    FieldRadioTabs |
    FieldRadioIcons |
    FieldAutocomplete |
    FieldSlider;

export interface Fieldsets {
    [key: string]: Field[];
}

export interface FormValues {
    [key: string]: any;
}

// ------------------------------------------------------------------------ Base
export interface FieldBase {
    name: string;
    value?: any;
    color?: string;
    default?: any;

    required?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    label?: string;
    width?: 'half' | 'full';
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

export type FieldSelectOptions = {[key: string]: string} | {value: string, label: string}[];
export interface FieldSelect extends FieldBase, FieldMixinIcon, FieldMixinPlaceholder {
    type: 'select';
    options?: FieldSelectOptions;
}

export interface FieldCheckbox extends FieldBase {
    type: 'checkbox';
    label?: 'string';
}

export interface FieldSubmit extends FieldBase, FieldMixinIcon {
    type: 'submit';
}

export interface FieldRadio extends FieldBase {
    type: 'radio';
    options?: FieldRadioOption[];
}

export interface FieldRadioTabs extends FieldBase {
    type: 'radio-tabs';
    options?: FieldRadioOption[];
}

export interface FieldRadioOption {
    [key: string]: string;
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
    columns?: number;
}

export interface FieldAutocomplete extends FieldBase, FieldMixinIcon, FieldMixinPlaceholder {
    type: 'autocomplete';
    results?: string[] | Function;
    minlength: number;
}

export interface FieldSlider extends FieldBase {
    type: 'slider';
    min?: number;
    max?: number;
    steps?: number;
    label?: string;
}
