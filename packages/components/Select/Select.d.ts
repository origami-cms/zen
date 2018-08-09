import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { FieldOptions } from '../../lib/FormValidator/FormFieldTypes';
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
