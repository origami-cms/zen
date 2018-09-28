import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { html } from '@polymer/lit-element';
import { FieldOption, FieldOptions } from '@origamijs/zen-lib/lib/FormValidator/FormFieldTypes';
import { component, dispatchChange, property } from '@origamijs/zen-lib/lib/decorators';
import {InputDropdown} from '@origamijs/zen-input-dropdown';
import CSS from './select-css';


export interface SelectProps {
    options: FieldOptions;
    value ?: string;
    name ?: string;
    placeholder ?: string;
    _open ?: boolean;
}

@component('zen-select')
@dispatchChange()
export class Select extends LitElement implements SelectProps {

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

    render(): TemplateResult {
        const { value, placeholder, options, _open } = this;

        let v;
        if (value) {
            if (options instanceof Array) {
                v = (options as FieldOption[]).find(({value: v}) => v === value);
                if (v) v = v.label;
                if (!v && (options as string[]).includes(value)) v = value;
            } else v = options[value];
        }


        return html`
            ${CSS}
            <div @click=${() => this._open = !this._open}>
                <div class="value">${
                    v || html`<span class="placeholder">${placeholder}</span>`
                }</div>

                <zen-icon
                    type="arrow-down"
                    color="grey-200"
                    class="${_open ? 'rotate' : ''}"
                ></zen-icon>
            </div>

            <zen-input-dropdown
                .options=${options}
                .value=${value}
                @change=${(e: {target: InputDropdown}) => this.value = e.target.value}
                ?open=${_open}
                @toggle=${(e: {target: InputDropdown}) => this._open = e.target.open}
            ></zen-input-dropdown>
        `;
    }
}
