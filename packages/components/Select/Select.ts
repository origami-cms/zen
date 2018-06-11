import {LitElement} from '@polymer/lit-element';
import {FieldOptions} from '../../lib/FormValidator/FormFieldTypes';
import {html} from 'lit-html/lib/lit-extended';
import {component, property} from 'polymer3-decorators/dist';
import {dispatchChange} from '../../util/decorators';
import Tooltip from '../Tooltip/Tooltip';
import CSS from './select-css';
import { TemplateResult } from 'lit-html';

export interface props {
    options: FieldOptions;
    value ?: string;
    name ?: string;
    placeholder ?: string;
    _open ?: boolean;
}

@component('zen-select')
@dispatchChange()
export default class Select extends LitElement implements props {

    @property
    options: FieldOptions = [];

    @property
    value?: string;

    @property
    name?: string;

    @property
    placeholder?: string;

    @property
    _open?: boolean;

    _render({value, placeholder, options, _open}: props): TemplateResult {
        let v;
        if (value) {
            if (options instanceof Array) {
                v = options.find(({value: v}) => v === value);
                if (v) v = v.label;
            } else v = options[value];
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
                on-change=${(e: {target: Tooltip}) => this.value = e.target.value}
                open=${_open}
                on-toggle=${(e: {target: Tooltip}) => this._open = e.target.open}
            ></zen-input-dropdown>
        `;
    }
}
