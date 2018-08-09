import { html, LitElement } from '@polymer/lit-element';

import CSS from './side-menu-css';
import { TemplateResult } from 'lit-html';
import { component } from 'util/decorators';

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
    links: Link[] = [
        {
            icon: 'organization',
            text: 'Organization',
            to: '/admin/settings/organization'
        },
        {
            icon: 'user',
            text: 'My settings',
            to: '/admin/settings/me'
        }
    ];

    _render({links}: SettingsMenuProps): TemplateResult {
        console.log('ok');

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
