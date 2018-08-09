import {LitElement} from '@polymer/lit-element';
import {FieldRadioIconsOption} from '../../lib/FormValidator/FormFieldTypes';
import {html} from 'lit-html/lib/lit-extended';
import {unsafeHTML} from 'lit-html/lib/unsafe-html';

import {component, property, bindAttributes, dispatchChange} from '../../util/decorators';
import CSS from './radio-icons-css';
import { TemplateResult } from 'lit-html';

export interface props {
    options: FieldRadioIconsOption[];
    value?: string | number;
    name?: string;
    columns?: number;
}

@component('zen-radio-icons')
@dispatchChange()
export default class RadioIcons extends LitElement implements props {
    @property
    options: FieldRadioIconsOption[] = [];

    @property
    value?: string | number;

    @property
    name?: string;

    @property
    columns?: number;

    _propertiesChanged(p: props, c: props, o: props) {
        super._propertiesChanged(p, c, o);
        if (c.columns) {
            this.style.setProperty(
                '--radio-icons-columns',
                `var(--radio-icons-columns-override, ${p.columns})`
            );
        }
    }

    _render({value, options}: props): TemplateResult {

        return html`
            ${CSS}
            <ul class="options">
                ${options.map(o => html`
                    <li
                        class$="option ${o.value === value ? 'active' : ''}"
                        on-click=${() => this.value = o.value}
                    >
                        <div class="img">
                            ${o.icon ? html`<zen-icon type=${o.icon}></zen-icon>` : '' }
                            ${o.image ? html`<img src=${o.image} />` : '' }
                            ${o.html ? html`${unsafeHTML(o.html)}` : '' }
                        </div>
                        <span>${o.label}</span>
                    </li>
                `)}
            </ul>
        `;
    }
}
