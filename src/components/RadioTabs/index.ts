import {html, LitElement} from '@polymer/lit-element';
import {FieldOptions} from 'lib/FormValidator/FormFieldTypes';
import {component, property} from 'polymer3-decorators/dist';
import {dispatchChange} from 'util/decorators';
import CSS from './radio-tabs-css';

interface props {
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

    _render({options, value}: props) {
        let opts: FieldOptions = [];
        if (options) {
            if (options instanceof Array) {
                opts = options;
            } else {
                opts = Object.entries(options).map(([v, label]) => ({
                    value: v,
                    label
                }));
            }
        }

        return html`
            ${CSS}
            ${opts.map(o => html`
                <div class$="tab ${value === o.value ? 'active' : ''}" on-click=${() => this.value = o.value}>
                    <span>${o.label}</span>
                </div>
            `)}
        `;
    }
}
