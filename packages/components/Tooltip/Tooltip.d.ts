import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export declare type TooltipPosition = 'top-left' | 'top' | 'top-right' | 'right-top' | 'right' | 'right-bottom' | 'bottom-right' | 'bottom' | 'bottom-left' | 'top-right' | 'left-bottom' | 'left' | 'left-top';
export interface props {
    position?: TooltipPosition;
    for: HTMLElement | null;
}
export default class Tooltip extends LitElement implements props {
    position?: TooltipPosition;
    for: HTMLElement | null;
    static _boundAttributes: string[];
    constructor();
    ready(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    readonly target: Element | null;
    hide(show?: boolean): void;
    _render(): TemplateResult;
    _didRender(): void;
    private _update();
    private _remove(e);
}
