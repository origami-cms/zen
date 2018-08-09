import { LitElement } from '@polymer/lit-element';
import { FieldOptions } from '../../lib/FormValidator/FormFieldTypes';
import { TemplateResult } from 'lit-html';
export interface props {
    options: FieldOptions;
    value?: string | number;
    name?: string;
}
export default class RadioTabs extends LitElement implements props {
    options: FieldOptions;
    value?: string | number;
    name?: string;
    _render({options, value}: props): TemplateResult;
}
