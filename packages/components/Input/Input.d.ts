import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    placeholder?: string;
    name?: string;
    type: string;
    icon?: string;
    loading?: boolean;
    value?: string;
    disabled?: string;
}
export default class Input extends LitElement implements props {
    placeholder?: string;
    name?: string;
    type: string;
    icon?: string;
    loading?: boolean;
    value?: string;
    disabled?: string;
    static _boundAttributes: string[];
    _render({icon, loading, type, placeholder, disabled, value}: props): TemplateResult;
    focus(): void;
    private _handleInput(e);
}
