import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export declare type TooltipPosition = 'top-left' | 'top' | 'top-right' | 'right-top' | 'right' | 'right-bottom' | 'bottom-right' | 'bottom' | 'bottom-left' | 'top-right' | 'left-bottom' | 'left' | 'left-top';
export interface props {
    position?: TooltipPosition;
    show: boolean;
    __show: boolean;
    for: HTMLElement | null;
    _for?: HTMLElement | string;
    on?: boolean | 'hover';
    _on?: boolean | 'hover';
}
export default class Tooltip extends LitElement implements props {
    position?: TooltipPosition;
    private static _boundAttributes;
    constructor();
    ready(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    show: boolean;
    __show: boolean;
    for: HTMLElement | null;
    _for?: string | HTMLElement;
    on: boolean | "hover" | undefined;
    _on?: boolean | 'hover';
    _render(): TemplateResult;
    _didRender(): void;
    private _show();
    private _hide();
    private _update();
    private _remove(e);
    private _updateHandlers(type);
}
