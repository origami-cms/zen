import { html, LitElement } from '@polymer/lit-element';

import CSS from './side-menu-css';
import { TemplateResult } from 'lit-html';
import { component, property } from '../../util/decorators';

export interface Link {
    icon?: string;
    text?: string;
    to?: string;
}

export interface SettingsMenuProps {
    links: Link[];
}


@component('zen-side-menu')
export default class SettingsMenu extends LitElement implements SettingsMenuProps {
    @property
    links: Link[] = [];

    _render({links}: SettingsMenuProps): TemplateResult {
        return html`
            ${CSS}
            <ul>
                ${links.map(l => html`
                    <li>
                        <zen-link href=${l.to}>
                            ${l.icon ? html`<zen-icon type=${l.icon} color='grey-300' size="medium"></zen-icon>` : ''}
                            <span>${l.text}</span>
                        </zen-link>
                    </li>
                `)}
            </ul>
        `;
    }
}
