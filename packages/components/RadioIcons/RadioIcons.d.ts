import { LitElement } from '@polymer/lit-element';
import { FieldRadioIconsOption } from '../../lib/FormValidator/FormFieldTypes';
import { TemplateResult } from 'lit-html';
export interface props {
    options: FieldRadioIconsOption[];
    value?: string | number;
    name?: string;
    columns?: number;
}
export default class RadioIcons extends LitElement implements props {
    options: FieldRadioIconsOption[];
    value?: string | number;
    name?: string;
    columns?: number;
    _propertiesChanged(p: props, c: props, o: props): void;
    _render({value, options}: props): TemplateResult;
}
