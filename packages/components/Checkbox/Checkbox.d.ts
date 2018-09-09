import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    name?: string;
    size?: string;
    checked?: boolean;
}
export default class Checkbox extends LitElement implements props {
    name?: string;
    size?: string;
    checked?: boolean;
    constructor();
    _render({checked}: props): TemplateResult;
    private _handleChange(e);
}
