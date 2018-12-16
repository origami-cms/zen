import { component, dispatchChange, property } from '@origami/zen-lib/lib/decorators';
import { FieldRadioIconsOption } from '@origami/zen-lib/lib/FormValidator/FormFieldTypes';
import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import CSS from './radio-icons-css';


export interface RadioIconsProps {
    options: FieldRadioIconsOption[];
    value: string | number | null;
    name?: string;
    columns?: number;
}

@component('zen-radio-icons')
@dispatchChange()
export class RadioIcons extends LitElement implements RadioIconsProps {
    @property
    options: FieldRadioIconsOption[] = [];

    @property
    value: string | number | null = null;

    @property
    name?: string;

    @property
    columns?: number;

    updated(p: any) {
        super.updated(p);

        const columns = p.get('columns');
        if (columns) {
            this.style.setProperty(
                '--radio-icons-columns',
                `var(--radio-icons-columns-override, ${columns})`
            );
        }
    }

    render(): TemplateResult {
        const { value, options } = this;

        return html`
            ${CSS}
            <ul class="options">
                ${options.map(o => html`
                    <li
                        class="option ${o.value === value ? 'active' : ''}"
                        @click=${() => this.value = o.value}
                    >
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
}
