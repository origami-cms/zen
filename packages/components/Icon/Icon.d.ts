import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    type?: string;
    color?: string;
    size?: string;
}
export default class Icon extends LitElement implements props {
    type?: string;
    color?: string;
    size?: string;
    static _boundAttributes: string[];
    _render({color, type}: {
        [key in keyof Icon]: any;
    }): TemplateResult;
    private readonly _symbol;
}
