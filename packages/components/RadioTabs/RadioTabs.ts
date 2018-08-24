import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { FieldOption, FieldOptions } from '../../lib/FormValidator/FormFieldTypes';
import { component, dispatchChange, property } from '../../util/decorators';
import CSS from './radio-tabs-css';


export interface props {
    options: FieldOptions;
    value?: string | number;
    name?: string;
}

@component('zen-radio-tabs')
@dispatchChange()
export default class RadioTabs extends LitElement implements props {

    @property
    options: FieldOptions = [];

    @property
    value?: string | number;

    @property
    name?: string;

    _render({options, value}: props): TemplateResult {
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
                <div class$="tab ${value === o.value ? 'active' : ''}" on-click=${() => this.value = o.value}>
                    <span>${o.label}</span>
                </div>
            `)}
        `;
    }
}
