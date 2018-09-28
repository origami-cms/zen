// tslint:disable function-name

import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import {FormRow} from '@origamijs/zen-form-row';

import { Field, FormValues } from '@origamijs/zen-lib/lib/FormValidator/FormFieldTypes';
import Validator, { ValidateFieldErrors } from '@origamijs/zen-lib/lib/FormValidator/Validator';
import CSS from './form-css';
import { component, property } from '@origamijs/zen-lib/lib/decorators';

export interface FormProps {
    values: FormValues;
    error?: string;
    fields: Field[];
    loading: boolean;
    fieldErrors: ValidateFieldErrors;
    _validateOnChange: boolean;
    _showErrors: boolean;
}
@component('zen-form')
export class Form extends LitElement implements FormProps {
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

    render(): TemplateResult {
        const { error, fields, values, fieldErrors } = this;

        const errors = fieldErrors || {};

        return html`
            ${CSS}
            ${error
                ? html`<div class="error"><zen-icon type="error".color="error"></zen-icon><span>${error}</span>`
                : ''
            }
            <form novalidate @submit="${this.submit}">
                ${fields.filter(f => !f.hidden).map((f: Field) => html`
                    <zen-form-row
                        .field=${f}
                        .value=${values[f.name]}
                        @change=${this._handleChange}
                        @submit=${this.submit}
                        .name=${f.name}
                        .error=${errors[f.name]}
                        .rowwidth=${f.width}
                        .disabled=${f.disabled}
                    ></zen-form-row>
                `)}
            </form>
        `;
    }

    scrollToError() {
        if (!this.fieldErrors) return;
        const row = (Array.from(this.shadowRoot!.querySelectorAll('zen-form-row')) as FormRow[])
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

        const active = this.shadowRoot!.querySelector('*:focus') as HTMLElement;
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

    updated(p: any) {
        super.updated(p);

        if (p && p.get('values')) {
            if (this._showErrors) this.validate();

            this.dispatchEvent(new CustomEvent('change'));
        }
    }

    private _handleChange(e: Event) {
        // @ts-ignore
        if (this.values[e.target.name] === e.target.value) return false;
        // @ts-ignore
        this.values = {...this.values, ...{[e.target.name]: e.target.value}};
    }
}
