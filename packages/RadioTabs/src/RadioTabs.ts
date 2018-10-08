import { component, dispatchChange, property } from '@origamijs/zen-lib/lib/decorators';
import { FieldOption, FieldOptions } from '@origamijs/zen-lib/lib/FormValidator/FormFieldTypes';
import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import CSS from './radio-tabs-css';


export interface RadioTabsProps {
    options: FieldOptions;
    value: string | number | null;
    name?: string;
}

@component('zen-radio-tabs')
@dispatchChange()
export class RadioTabs extends LitElement implements RadioTabsProps {

    @property
    options: FieldOptions = [];

    @property
    value: string | number | null = null;

    @property
    name?: string;

    render(): TemplateResult {
        const { options, value } = this;

        let opts: FieldOptions = [];
        if (options) {
            if (options instanceof Array) {
                opts = options;
                if (typeof opts[0] === 'string') {
                    opts = (opts as string[]).map((o: string) => ({value: o, label: o}));
                }
            } else {
                opts = Object.entries(options).map(([value, label]) => ({
                    value,
                    label
                }));
            }
        }

        return html`
            ${CSS}
            ${(opts as FieldOption[]).map(o => html`
                <div class="tab ${value === o.value ? 'active' : ''}" @click=${() => this.value = o.value}>
                    <span>${o.label}</span>
                </div>
            `)}
        `;
    }
}
