import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { InputDropdownResults } from '../../lib/FormValidator/FormFieldTypes';
export interface props {
    value?: string;
    options: InputDropdownResults;
    open: boolean;
    _active?: number;
}
export default class InputDropdown extends LitElement implements props {
    value?: string;
    options: InputDropdownResults;
    open: boolean;
    _active?: number;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    _render({options, value, open, _active}: props): TemplateResult;
    _didRender(): void;
    private _options(options);
    private _handleKeyDown(e);
    private _handleClick(e);
}
