import { html, LitElement } from '@polymer/lit-element';

import CSS from './side-menu-css';
import { TemplateResult } from 'lit-html';
import { component, property } from '@origamijs/zen-lib/lib/decorators';

export interface SideMenu {
    icon?: string;
    text?: string;
    to?: string;
}

export interface SettingsMenuProps {
    links: SideMenu[];
}


@component('zen-side-menu')
export class SideMenu extends LitElement implements SettingsMenuProps {
    @property
    links: SideMenu[] = [];

    render(): TemplateResult {
        return html`
            ${CSS}
            <ul>
                ${this.links.map(l => html`
                    <li>
                        <zen-link .href=${l.to}>
                            ${l.icon ? html`<zen-icon .type=${l.icon}.color='grey-300' size="medium"></zen-icon>` : ''}
                            <span>${l.text}</span>
                        </zen-link>
                    </li>
                `)}
            </ul>
        `;
    }
}
