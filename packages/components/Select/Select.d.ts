import { LitElement } from '@polymer/lit-element';
import { FieldOptions } from '../../lib/FormValidator/FormFieldTypes';
import { TemplateResult } from 'lit-html';
export interface props {
    options: FieldOptions;
    value?: string;
    name?: string;
    placeholder?: string;
    _open?: boolean;
}
export default class Select extends LitElement implements props {
    options: FieldOptions;
    value?: string;
    name?: string;
    placeholder?: string;
    _open?: boolean;
    _render({value, placeholder, options, _open}: props): TemplateResult;
}
