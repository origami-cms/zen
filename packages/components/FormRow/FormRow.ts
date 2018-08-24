// tslint:disable function-name
import {LitElement} from '@polymer/lit-element';
import {ValidationErrors} from '../../lib/FormValidator';
import {Field} from '../../lib/FormValidator/FormFieldTypes';
import {html} from 'lit-html/lib/lit-extended';

import {component, property, bindAttributes, dispatchChange} from '../../util/decorators';
import CSS from './form-row-css';
import { TemplateResult } from 'lit-html';
import Input from '../Input/Input';

export interface props {
    field?: Field;
    name?: string;
    value?: any;
    error?: ValidationErrors;
    rowwidth?: 'half';
    hidden: boolean;
    disabled: boolean;
}

@component('zen-form-row')
@dispatchChange()
@bindAttributes
export default class FormRow extends LitElement implements props {
    @property
    field?: Field;

    @property
    name?: string;

    @property
    value?: any;

    @property
    error?: ValidationErrors;

    @property
    rowwidth?: 'half';

    hidden: boolean = false;

    @property
    disabled: boolean = false;

    static _boundAttributes = ['rowwidth', 'disabled'];

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this);
        this.submit = this.submit.bind(this);

        this.addEventListener('keyup', this._handleKeyUp.bind(this));
    }

    _render({error, field, value}: props): TemplateResult {
        let e;
        if (error) e = Object.values(error)[0];

        if (!field) return html``;
        const f = this._renderField(field, value);

        return html`
            ${CSS}
            ${e
                ? html`<span class="error">
                    <zen-icon type="error" color="error"></zen-icon>
                    ${e}
                </span>`
                : ''
            }
            ${field.label
                ? html`<span class="label">${field.label}</span>`
                : ''
            }
            ${f}
        `;
    }

    focus() {
        if (!this.field) return;
        if (['text', 'number', 'password', 'email', 'date', 'tel'].includes(this.field.type)) {
            (this.shadowRoot!.querySelector('zen-input') as Input).focus();
        }
    }

    private _handleChange(e: Event) {
        const t = e.target as HTMLInputElement;
        if (t.tagName === 'ZEN-CHECKBOX') return this.value = t.checked;

        this.value = t.value;
    }

    private submit() {
        this.dispatchEvent(new CustomEvent('submit'));
    }


    _renderField(f: Field, value: any) {
        const v = value;
        const c = this._handleChange;
        switch (f.type) {
            case 'text':
            case 'number':
            case 'password':
            case 'email':
            case 'date':
            case 'tel':
                return html`<zen-input
                    type=${f.type}
                    icon=${f.icon}
                    value=${v}
                    on-change=${c}
                    placeholder=${f.placeholder}
                    disabled=${f.disabled}
                ></zen-input>`;

            case 'color':
                return html`<zen-input-color
                    type=${f.type}
                    value=${v}
                    on-change=${c}
                    placeholder=${f.placeholder}
                    disabled=${f.disabled}
                ></zen-input-color>`;

            case 'textarea':
                return html`<textarea
                    value=${v}
                    on-change=${c}
                    placeholder=${f.placeholder}
                    disabled=${f.disabled}
                ></textarea>`;

            case 'submit':
                return html`<zen-button
                    icon=${f.icon}
                    on-click=${this.submit}
                    color=${f.color}
                    disabled=${f.disabled}
                >${f.value}</zen-button>`;

            case 'select':
                return html`<zen-select
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                    placeholder=${f.placeholder}
                    disabled=${f.disabled}
                ></zen-select>`;

            case 'checkbox':
                return html`<zen-checkbox
                    checked=${v}
                    on-change=${c}
                    disabled=${f.disabled}
                ></zen-checkbox>`;

            case 'radio':
                return html`<zen-radio
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                    disabled=${f.disabled}
                ></zen-radio>`;

            case 'radio-tabs':
                return html`<zen-radio-tabs
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                    disabled=${f.disabled}
                ></zen-radio-tabs>`;

            case 'radio-icons':
                return html`<zen-radio-icons
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                    columns=${f.columns}
                    disabled=${f.disabled}
                ></zen-radio-icons>`;

            case 'checkbox-icons':
                return html`<zen-checkbox-icons
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                    columns=${f.columns}
                    disabled=${f.disabled}
                ></zen-checkbox-icons>`;

            case 'autocomplete':
                return html`<zen-autocomplete
                    icon=${f.icon}
                    value=${v}
                    on-change=${c}
                    minlength=${f.minlength}
                    placeholder=${f.placeholder}
                    options=${f.options}
                    disabled=${f.disabled}
                    query=${f.query}
                ></<zen-autocomplete>`;
        }
    }


    private _handleKeyUp(e: KeyboardEvent) {
        switch (e.key) {
            case 'Enter':
                this.dispatchEvent(new CustomEvent('submit'));
                break;
        }
    }
}
