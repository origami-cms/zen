import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    color?: string;
    size?: string;
}
export default class Loading extends LitElement implements props {
    color?: string;
    size?: string;
    static _boundAttributes: string[];
    _render(): TemplateResult;
}
