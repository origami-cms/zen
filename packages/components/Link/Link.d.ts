import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface props {
    href?: string;
}
export default class Link extends LitElement implements props {
    href?: string;
    connectedCallback(): void;
    _firstRendered(): void;
    _render(): TemplateResult;
    _updateClass(l: Location): void;
}
