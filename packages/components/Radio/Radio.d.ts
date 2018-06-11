import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    options: {
        [key: string]: string;
    };
    value?: string;
    name?: string;
}
export default class Radio extends LitElement implements props {
    options: {};
    value?: string;
    name?: string;
    _render({value, options}: props): TemplateResult;
}
