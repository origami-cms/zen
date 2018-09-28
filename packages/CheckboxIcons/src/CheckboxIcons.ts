import { component, property } from '@origamijs/zen-lib/lib/decorators';
import { FieldCheckboxIconsOption } from '@origamijs/zen-lib/lib/FormValidator/FormFieldTypes';
import { html, LitElement } from '@polymer/lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
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

    updated(p: any) {
        super.updated(p);
        const columns = p.get('columns');
        if (p && columns) {
            this.style.setProperty(
                '--radio-icons-columns',
                `var(--radio-icons-columns-override, ${columns})`
            );
        }
    }

    render(): TemplateResult {
        let { value, options } = this;
        value = value || [];


        return html`
            ${CSS}
            <ul class="options">
                ${options.map(o => html`
                    <li
                        class="option ${value.includes(o.value) ? 'active' : ''}"
                        @click=${() => this._toggle(o.value)}
                    >
                        <zen-checkbox
                            ?checked=${value.includes(o.value)}
                            @click=${() => this._toggle(o.value)}
                        ></zen-checkbox>
                        <div class="img">
                            ${o.icon ? html`<zen-icon .type=${o.icon}></zen-icon>` : '' }
                            ${o.image ? html`<img .src=${o.image} />` : '' }
                            ${o.html ? html`${unsafeHTML(o.html)}` : '' }
                        </div>
                        <span>${o.label}</span>
                    </li>
                `)}
            </ul>
        `;
    }

    private _toggle(v: string | number) {
        let val = this.value || [];

        if (!val.includes(v)) {
            val.push(v);
            this.value = val;
        } else this.value = val.filter(_v => v !== _v);

        this.requestUpdate();
        this.dispatchEvent(new CustomEvent('change'));
    }
}
