import {ValidatorRules, ValidateBase, ValidateString, ValidateEqual} from './Validator/rules';


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


export interface FieldSelect extends FieldBase, FieldMixinIcon, FieldMixinPlaceholder {
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

export interface FieldRadio extends FieldBase {
    type: 'radio';
    options?: {
        [key: string]: string
    };
}

export interface FieldRadioTabs extends FieldBase {
    type: 'radio-tabs';
    options?: {
        [key: string]: string
    };
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
