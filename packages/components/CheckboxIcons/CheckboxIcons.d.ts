import { LitElement } from '@polymer/lit-element';
import { FieldCheckboxIconsOption } from '../../lib/FormValidator/FormFieldTypes';
import { TemplateResult } from 'lit-html';
export interface props {
    options: FieldCheckboxIconsOption[];
    value: (string | number)[];
    name?: string;
    columns?: number;
}
export default class CheckboxIcons extends LitElement implements props {
    options: FieldCheckboxIconsOption[];
    value: (string | number)[];
    name?: string;
    columns?: number;
    _propertiesChanged(p: props, c: props, o: props): void;
    _render({value, options}: props): TemplateResult;
    private _toggle(v);
}
