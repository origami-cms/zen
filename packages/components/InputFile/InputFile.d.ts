import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    placeholder?: string;
    _img?: any;
    _icon: string;
}
export default class InputFile extends LitElement implements props {
    placeholder?: string;
    files: File[];
    private _reader;
    _img?: any;
    _icon: string;
    constructor();
    _render({placeholder, _img, _icon}: props): TemplateResult;
    private _handleChange(e);
}
