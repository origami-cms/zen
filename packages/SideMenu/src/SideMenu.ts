import { html, LitElement, customElement, property } from '@polymer/lit-element';

import CSS from './side-menu-css';
import { TemplateResult } from 'lit-html';

export interface SideMenuLink {
    icon?: string;
    text?: string;
    href?: string;
}

export interface SettingsMenuProps {
    links: SideMenuLink[];
}

// @ts-ignore
@customElement('zen-side-menu')
export class SideMenu extends LitElement implements SettingsMenuProps {
    @property()
    links: SideMenuLink[] = [];

    render(): TemplateResult {
        return html`
            ${CSS}
            <ul>
                ${this.links.map(l => html`
                    <li>
                        <zen-link .href=${l.href}>
                            ${l.icon ? html`<zen-icon type=${l.icon} color='grey-300' size="medium"></zen-icon>` : ''}
                            <span>${l.text}</span>
                        </zen-link>
                    </li>
                `)}
            </ul>
        `;
    }
}
