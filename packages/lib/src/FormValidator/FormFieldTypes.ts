import { ValidateBase, ValidateEqual, ValidateString } from './rules';

export type Field =
FieldDefault |
FieldSelect |
FieldCheckbox |
FieldSubmit |
FieldRadio |
FieldRadioTabs |
FieldRadioIcons |
FieldCheckboxIcons |
FieldAutocomplete |
FieldSlider |
FieldColor |
FieldRichTextEditor;

export interface Fieldsets {
    [key: string]: Field[];
}

export interface FormValues {
    [key: string]: any;
}

// ------------------------------------------------------------------------ Base
export interface FieldBase {
    name: string;
    value: any | null;
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

export interface FieldOption {
    value: number | string;
    label: number | string;
}

export type FieldOptions =
{ [key: string]: string } |
FieldOption[] |
string [];

export interface FieldMixinOptions {
    options?: FieldOptions;

}

// ---------------------------------------------------------------------- Fields
export interface FieldDefaultValidation extends ValidateBase, ValidateString, ValidateEqual { }
export interface FieldDefault extends FieldBase, FieldMixinPlaceholder, FieldMixinIcon {
    type: 'text' | 'textarea' | 'input' | 'password' | 'email' | 'date' | 'number' | 'tel';
    validate?: FieldDefaultValidation;
}

export interface FieldSelect extends FieldBase, FieldMixinIcon, FieldMixinPlaceholder, FieldMixinOptions {
    type: 'select';
}

export interface FieldCheckbox extends FieldBase {
    type: 'checkbox';
    label?: 'string';
}

export interface FieldSubmit extends FieldBase, FieldMixinIcon {
    type: 'submit';
}

export interface FieldRadio extends FieldBase, FieldMixinOptions {
    type: 'radio';
}

export interface FieldRadioTabs extends FieldBase, FieldMixinOptions {
    type: 'radio-tabs';
}

export interface FieldRadioIconsOption {
    icon?: string;
    image?: string;
    html?: string;
    value: number | string;
    label: number | string;
}
export interface FieldRadioIcons extends FieldBase {
    type: 'radio-icons';
    options?: FieldRadioIconsOption[];
    columns?: number;
}

export interface FieldCheckboxIconsOption {
    icon?: string;
    image?: string;
    html?: string;
    value: number | string;
    label: number | string;
}
export interface FieldCheckboxIcons extends FieldBase {
    type: 'checkbox-icons';
    options?: FieldCheckboxIconsOption[];
    columns?: number;
}

export interface FieldAutocomplete extends FieldBase, FieldMixinIcon, FieldMixinPlaceholder {
    type: 'autocomplete';
    results?: string[] | Function;
    minlength: number;
    options: Function | InputDropdownResults;
    query?: string;
}

export interface FieldSlider extends FieldBase {
    type: 'slider';
    min?: number;
    max?: number;
    steps?: number;
    label?: string;
}

export interface FieldColor extends FieldBase, FieldMixinPlaceholder {
    type: 'color';
}


export type InputDropdownResults = InputDropdownOptions | InputDropdownList;
export interface InputDropdownOptions { [key: string]: string | number; }
export type InputDropdownList = string[];


export interface FieldRichTextEditor extends FieldBase {
    type: 'rich-text';
}
