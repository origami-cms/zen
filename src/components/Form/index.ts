// tslint:disable function-name

import {html, LitElement} from '@polymer/lit-element';
import {Field, FormValues} from 'lib/FormValidator/FormFieldTypes';
import Validator, {ValidateFieldErrors} from 'lib/FormValidator/Validator';
import {component, property} from 'polymer3-decorators/dist';
import CSS from './form-css';

@component('zen-form')
export default class Form extends LitElement {
    @property
    values: FormValues = {};

    @property
    error?: string;

    @property
    fields: Field[] = [];

    @property
    loading: boolean = false;

    @property
    private _fieldErrors: ValidateFieldErrors = {};
    private _validateOnChange: boolean = false;
    private _showErrors: boolean = false;

    constructor() {
        super();
        this.submit = this.submit.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    _render({error, fields, values, _fieldErrors}: {[key in keyof Form]: any}) {
        const errors = _fieldErrors || {};

        return html`
            ${CSS}
            ${error
                ? html`<div><zen-icon type="error" color="error"></zen-icon><span>${error}</span>`
                : ''
            }
            <form novalidate on-submit="${this.submit}">
                ${fields.filter(f => !f.hidden).map((f: Field) => html`
                    <zen-form-row
                        field=${f}
                        value=${values[f.name]}
                        on-change=${this._handleChange}
                        name=${f.name}
                        error=${errors[f.name]}
                        rowwidth=${f.width}
                    ></zen-form-row>
                `)}
            </form>
        `;
    }

    submit(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.validate()) return false;

        const active = this.shadowRoot.querySelector('*:focus') as HTMLElement;
        if (active && active.blur) active.blur();

        this.dispatchEvent(new CustomEvent('submit'));

        return false;
    }

    validate(showErrors: boolean = true) {
        this._validateOnChange = true;
        this._showErrors = showErrors;

        const v = new Validator({
            fields: this.fields
        });

        const {valid, fields} = v.validate(this.values);

        this._fieldErrors = fields;

        this.dispatchEvent(new CustomEvent('validated', {
            detail: {valid}
        }));

        return valid;
    }

    _propertiesChanged(p, c, o) {
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
