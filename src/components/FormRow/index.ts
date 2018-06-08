// tslint:disable function-name
import {LitElement} from '@polymer/lit-element';
import {ValidationErrors} from 'lib/FormValidator';
import {Field} from 'lib/FormValidator/FormFieldTypes';
import {html} from 'lit-html/lib/lit-extended';
import {component, property} from 'polymer3-decorators/dist';
import {bindAttributes, dispatchChange} from 'util/decorators';
import CSS from './form-row-css';

interface props {
    field?: Field;
    name?: string;
    value?: any;
    error?: ValidationErrors;
    rowwidth?: 'half';
    hidden: boolean;
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

    static _boundAttributes = ['rowwidth'];

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this);
    }

    _render({error, field, value}: props) {
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

    private _handleChange(e: Event) {
        const t = e.target as HTMLInputElement;
        if (t.tagName === 'ZEN-CHECKBOX') return this.value = t.checked;

        this.value = t.value;
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
                ></zen-input>`;

            case 'textarea':
                return html`<textarea
                    value=${v}
                    on-change=${c}
                    placeholder=${f.placeholder}
                ></textarea>`;

            case 'submit':
                return html`<zen-button>Submit
                </zen-button>`;

            case 'select':
                return html`<zen-select
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                    placeholder=${f.placeholder}
                ></zen-select>`;

            case 'checkbox':
                return html`<zen-checkbox
                    checked=${v}
                    on-change=${c}
                ></zen-checkbox>`;

            case 'radio':
                return html`<zen-radio
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                ></zen-radio>`;

            case 'radio-tabs':
                return html`<zen-radio-tabs
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                ></zen-radio-tabs>`;

            case 'radio-icons':
                return html`<zen-radio-icons
                    value=${v}
                    on-change=${c}
                    options=${f.options}
                    columns=${f.columns}
                ></zen-radio-icons>`;

            case 'autocomplete':
                return html`<zen-autocomplete
                    icon=${f.icon}
                    value=${v}
                    on-change=${c}
                    minlength=${f.minlength}
                    placeholder=${f.placeholder}
                ></<zen-autocomplete>`;
        }
    }
}
