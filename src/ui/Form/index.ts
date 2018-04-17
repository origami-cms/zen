import {isEqual} from 'lodash';
import {Button} from '..';
import Element from '../../lib/Element';
import Icon from '../Icon';
import {Field, FieldMixinIcon} from './FieldTypes';
import FormRow from './FormRow';
import Validator, {ValidateFieldErrors, ValidationErrors} from './Validator/Validator';
import HTML from './form.html';
import CSS from './form.scss';


export {default as FormRow} from './FormRow';
export {default as Checkbox} from './Checkbox';
export {default as RadioIcons} from './RadioIcons';
export {default as Select} from './Select';
export {default as Radio} from './Radio';
export {default as Autocomplete} from './Autocomplete';
export {default as Slider} from './Slider';
export * from './FieldTypes';


export interface Fieldsets {
    [key: string]: Field[];
}

export interface FormValues {
    [key: string]: any;
}


export default class Form extends Element {
    form: HTMLFormElement;
    error: string | null = null;
    values: FormValues = {};
    fields: Field[] = [];
    loading: boolean = false;

    private _fieldErrors: ValidateFieldErrors | undefined = undefined;
    private _validateOnChange: boolean = false;
    private _showErrors: boolean = false;

    constructor() {
        super(HTML, CSS.toString(), 'Form');

        this.form = this._root.querySelector('form') as HTMLFormElement;
    }

    connectedCallback() {
        super.connectedCallback();
        this.form.addEventListener('submit', this.submit.bind(this));
    }

    static get boundProps() {
        return ['fields', 'values', 'error', '_fieldErrors', 'loading'];
    }

    static get observedAttributes() {
        return [
            'fields'
        ];
    }


    // Ordered array of field names currently in the form's fields
    private get _fieldOrder(): string[] {
        return this.fields.map(f => {
            if (f.type === 'submit') return 'submit';
            return f.name;
        });
    }


    async propertyChangedCallback(prop: keyof Form, oldV: string, newV: string): Promise<void> {
        await this.ready();
        switch (prop) {
            case 'error':
                this.updateError();
                break;

            case 'values':
                if (this._validateOnChange) this.validate(this._showErrors);
                this.trigger('change', this.values, true);
                break;

            case 'loading':
                const submit = this._root.querySelector('.submit-button');
                if (submit) (submit as Button).disabled = Boolean(newV);

            default:
                break;
        }
    }


    updateError() {
        const err = this._root.querySelector('.main-error') as HTMLSpanElement;
        if (err) err.style.display = !this.error ? 'none' : '';
    }


    render() {
        super.render();

        if (!this.fields) return;

        // Loop over each field and either update the existing row, or
        // create a new one
        this.fields.forEach(f => {
            const v = this.values[f.name] || '';

            // Attempt to update an existing row/field or create a new one
            if (!this._updateExistingRow(f, v)) this._createRow(f, v);
        });


        // Reorder the form rows based on the fields property
        if (this.form) {
            const children = Array.from(this.form.children);
            const order = this._fieldOrder;


            // If the order and the existing field order don't match, reorder
            if (!isEqual(order, children.map(el => el.getAttribute('name')))) {
                children
                    .map((el): [number, FormRow] => [
                        order.indexOf(el.getAttribute('name') || ''),
                        this.form.removeChild(el) as FormRow
                    ])
                    .sort((prev, next) => {
                        if (prev[0] < next[0]) return -1;
                        if (prev[0] > next[0]) return 1;
                        return 0;
                    })
                    .forEach(el => this.form.appendChild(el[1] as HTMLElement));
            }
        }

        this.updateError();
    }

    private _updateExistingRow(f: Field, v: any): boolean {
        let errors: false | ValidationErrors = false;
        if (this._fieldErrors) errors = this._fieldErrors[f.name];


        // Attempt to find an existing row...
        const existing = this._root.querySelector(`zen-ui-form-row[name='${f.name}']`) as FormRow;


        if (!existing && f.type === 'submit') {
            const s = this._root.querySelector('zen-ui-form-row[type="submit"]') as FormRow;
            if (s) {
                s.value = f.value || 'Submit';
                return true;
            }

            return false;
        }

        // If there is an existing row, update it's value, then continue
        // to next field
        if (existing) {
            if (existing.value !== v) existing.value = v;

            // @ts-ignore
            if (f.type === 'select') existing.field.options = f.options;

            if (this._showErrors && errors) {
                existing.error = errors[Object.keys(errors)[0]];
            } else existing.error = null;

            existing.hidden = Boolean(f.hidden);

            return true;
        }

        return false;
    }


    private _createRow(f: Field, v: any): FormRow | false {

        if (f.hidden) return false;

        const row = document.createElement('zen-ui-form-row') as FormRow;
        row.setAttribute('name', f.type === 'submit' ? 'submit' : f.name);

        row.field = f;

        (row.shadowRoot as ShadowRoot).addEventListener('change', (e: CustomEventInit) => {

            this.values = {
                ...this.values,
                ...{[f.name]: e.detail}
            };
        });
        this.form.appendChild(row as HTMLElement);
        row.value = v;
        row.setAttribute('type', f.type);

        (row.shadowRoot as ShadowRoot).addEventListener('submit', this.submit.bind(this));
        return row;
    }


    submit(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.validate()) return false;

        const active = this._root.querySelector('*:focus') as HTMLElement;
        if (active && active.blur) active.blur();

        this.trigger('submit');

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

        this.trigger('validated', {
            valid
        });

        return valid;
    }
}

window.customElements.define('zen-ui-form', Form);
