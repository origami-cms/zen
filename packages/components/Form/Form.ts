// tslint:disable function-name

import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import FormRow from '../FormRow/FormRow';

import { Field, FormValues } from '../../lib/FormValidator/FormFieldTypes';
import Validator, { ValidateFieldErrors } from '../../lib/FormValidator/Validator';
import CSS from './form-css';
import { component, property } from 'util/decorators';

export interface props {
    values: FormValues;
    error?: string;
    fields: Field[];
    loading: boolean;
    fieldErrors: ValidateFieldErrors;
    _validateOnChange: boolean;
    _showErrors: boolean;
}
@component('zen-form')
export default class Form extends LitElement implements props {
    @property
    values: FormValues = {};

    @property
    error?: string;

    @property
    fields: Field[] = [];

    @property
    loading: boolean = false;

    @property
    fieldErrors: ValidateFieldErrors = {};

    _validateOnChange: boolean = false;
    _showErrors: boolean = false;

    constructor() {
        super();
        this.submit = this.submit.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    _render({error, fields, values, fieldErrors}: props): TemplateResult {
        const errors = fieldErrors || {};

        return html`
            ${CSS}
            ${error
                ? html`<div class="error"><zen-icon type="error" color="error"></zen-icon><span>${error}</span>`
                : ''
            }
            <form novalidate on-submit="${this.submit}">
                ${fields.filter(f => !f.hidden).map((f: Field) => html`
                    <zen-form-row
                        field=${f}
                        value=${values[f.name]}
                        on-change=${this._handleChange}
                        on-submit=${this.submit}
                        name=${f.name}
                        error=${errors[f.name]}
                        rowwidth=${f.width}
                        disabled=${f.disabled}
                    ></zen-form-row>
                `)}
            </form>
        `;
    }

    scrollToError() {
        if (!this.fieldErrors) return;
        const row = (Array.from(this.shadowRoot.querySelectorAll('zen-form-row')) as FormRow[])
            .find(r => r.name === Object.keys(this.fieldErrors)[0]);
        if (!row) return;
        row.scrollIntoView();

        return row;
    }

    submit(e?: Event) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!this.validate()) return false;

        const active = this.shadowRoot.querySelector('*:focus') as HTMLElement;
        if (active && active.blur) active.blur();

        this.dispatchEvent(new CustomEvent('submit'));

        return false;
    }

    validate(showErrors: boolean = true) {
        this._validateOnChange = true;
        this._showErrors = showErrors;

        this.fieldErrors = {};

        const v = new Validator({
            fields: this.fields
        });

        const {valid, fields} = v.validate(this.values);

        if (fields) {
            this.fieldErrors = fields;
            const row = this.scrollToError();
            if (row) row.focus();
        }

        this.dispatchEvent(new CustomEvent('validated', {
            detail: {valid}
        }));

        return valid;
    }

    _propertiesChanged(p: props, c: props, o: props) {
        super._propertiesChanged(p, c , o);
        if (c && c.values) {
            if (this._showErrors) this.validate();

            this.dispatchEvent(new CustomEvent('change'));
        }
    }

    private _handleChange(e: Event) {
        // @ts-ignore
        this.values = {...this.values, ...{[e.target.name]: e.target.value}};
    }
}
