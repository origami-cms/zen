import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export declare type InputDropdownResults = InputDropdownOptions | InputDropdownList;
export interface InputDropdownOptions {
    [key: string]: string | number;
}
export declare type InputDropdownList = string[];
export interface props {
    value?: string;
    options: InputDropdownResults;
    open: boolean;
}
export default class InputDropdown extends LitElement implements props {
    value?: string;
    options: InputDropdownResults;
    open: boolean;
    private static _boundAttributes;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    _render({options, value, open}: props): TemplateResult;
    private _options(options, value);
    private _handleEscape(e);
    private _handleClick(e);
    _propertiesChanged(p: props, c: props, o: props): Promise<void>;
}
