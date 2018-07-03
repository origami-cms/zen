import {LitElement} from '@polymer/lit-element';
import {FieldCheckboxIconsOption} from '../../lib/FormValidator/FormFieldTypes';
import {html} from 'lit-html/lib/lit-extended';
import {unsafeHTML} from 'lit-html/lib/unsafe-html';
import {component, property} from 'polymer3-decorators/dist';
import {dispatchChange} from '../../util/decorators';
import CSS from './checkbox-icons-css';
import { TemplateResult } from 'lit-html';

export interface props {
    options: FieldCheckboxIconsOption[];
    value: (string | number)[];
    name?: string;
    columns?: number;
}

@component('zen-checkbox-icons')
export default class CheckboxIcons extends LitElement implements props {
    @property
    options: FieldCheckboxIconsOption[] = [];

    @property
    value: (string | number)[] = [];

    @property
    name?: string;

    @property
    columns?: number;

    _propertiesChanged(p: props, c: props, o: props) {
        super._propertiesChanged(p, c, o);
        if (c && c.columns) {
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
                        class$="option ${value.includes(o.value) ? 'active' : ''}"
                        on-click=${() => this._toggle(o.value)}
                    >
                        <zen-checkbox
                            checked=${value.includes(o.value)}
                            on-click=${() => this._toggle(o.value)}
                        ></zen-checkbox>
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

    private _toggle(v: string | number) {
        if (!this.value.includes(v)) this.value.push(v);
        else this.value = this.value.filter(_v => v !== _v);
        this._requestRender();
        this.dispatchEvent(new CustomEvent('change'));

    }
}
