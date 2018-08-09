import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface Link {
    icon?: string;
    text?: string;
    to?: string;
}
export interface SettingsMenuProps {
    links: Link[];
}
export default class SettingsMenu extends LitElement implements SettingsMenuProps {
    links: Link[];
    _render({links}: SettingsMenuProps): TemplateResult;
}
