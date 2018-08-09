import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    value: string | null;
    placeholder: string | null;
}
export default class InputColor extends LitElement implements props {
    value: string | null;
    placeholder: string | null;
    constructor();
    _render({value, placeholder}: props): TemplateResult;
    private _handleChange(e);
}
