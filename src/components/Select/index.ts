import {LitElement} from '@polymer/lit-element';
import {FieldSelectOptions} from 'lib/FormValidator/FormFieldTypes';
import {html} from 'lit-html/lib/lit-extended';
import {component, property} from 'polymer3-decorators/dist';
import {dispatchChange} from 'util/decorators';
import CSS from './select-css';

@component('zen-select')
@dispatchChange()
export default class Select extends LitElement {

    @property
    options: FieldSelectOptions[] = [];

    @property
    value?: string;

    @property
    name?: string;

    @property
    placeholder?: string;

    @property
    private _open?: boolean;

    _render({value, placeholder, options, _open}) {
        let v;
        if (value) {
            v = options[value];
            if (!v && typeof options.find === 'function') {
                v = options.find(({value: v}) => v === value);
                if (v) v = v.label;
            }
        }
        return html`
            ${CSS}
            <div class="value" on-click=${() => this._open = !this._open}>${
                v || html`<span class="placeholder">${placeholder}</span>`
            }</div>

            <zen-icon type="arrow-down" color="grey-200"></zen-icon>

            <zen-input-dropdown
                options=${options}
                value=${value}
                on-change=${e => this.value = e.target.value}
                open=${_open}
                on-toggle=${e => this._open = e.target.open}
            ></zen-input-dropdown>
        `;
    }
}
