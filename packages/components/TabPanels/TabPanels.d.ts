import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface Tab {
    icon?: string;
    text?: string;
    disabled?: boolean;
}
export interface TabPanelsProps {
    tabs: Tab[];
}
export default class Tabs extends LitElement implements TabPanelsProps {
    tabs: Tab[];
    noexpand: boolean;
    active: number;
    private _active;
    static _boundAttributes: string[];
    connectedCallback(): void;
    _render({tabs}: TabPanelsProps): TemplateResult;
}
