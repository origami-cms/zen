import {LitElement, html} from '@polymer/lit-element';
import '@polymer/polymer/lib/elements/dom-repeat';
import {FieldRadioOption} from 'lib/FormValidator/FormFieldTypes';
import {component, computed, observe, property} from 'polymer3-decorators/dist';
import {view, dispatchChange} from 'util/decorators';
import HTML from './radio-tabs.html';
import CSS from './radio-tabs-css';

@component('zen-radio-tabs')
@dispatchChange()
export default class RadioTabs extends LitElement {

    @property
    options: FieldRadioOption[] = [];

    @property
    value?: string;

    @property
    name?: string;

    _render({options, value}) {
        let opts = [];
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
