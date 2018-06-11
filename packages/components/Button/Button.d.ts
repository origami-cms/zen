import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    size?: string;
    icon?: string | false;
    'iconright': boolean;
    hollow?: boolean;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
}
export default class Button extends LitElement implements props {
    size?: string;
    icon?: string | false;
    'iconright': boolean;
    hollow?: boolean;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
    private static _boundAttributes;
    private readonly _icon;
    _render({icon, size, hollow}: props): TemplateResult;
    private readonly _iconColor;
    private _iconChanged(newV);
}
