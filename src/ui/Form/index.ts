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
export {default as Input} from './Input';
export {default as Checkbox} from './Checkbox';
export {default as RadioIcons} from './RadioIcons';
export {default as Select} from './Select';
export {default as Radio} from './Radio';
export {default as RadioTabs} from './RadioTabs';
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
    form?: HTMLFormElement;
    error: string | null = null;
    values: FormValues = {};
    fields: Field[] = [];
    loading: boolean = false;

    static boundProps = ['fields', 'values', 'error', '_fieldErrors', 'loading'];
    static observedAttributes = ['fields'];

    private _fieldErrors: ValidateFieldErrors | undefined;
    private _validateOnChange: boolean = false;
    private _showErrors: boolean = false;
    private _updatingValues: boolean = false;


    constructor() {
        super(HTML, CSS.toString());
    }


    connectedCallback() {
        super.connectedCallback();

        this.form = this._root.querySelector('form') as HTMLFormElement;
        this.form.addEventListener('submit', this.submit.bind(this));
    }


    async propertyChangedCallback(prop: keyof Form, oldV: any, newV: any) {
        await this.ready();
        switch (prop) {
            case 'error':
                this._updateError();
                break;

            case 'values':
                this._updateValues(newV);
                break;

            case 'loading':
                const submit = this._root.querySelector('.submit-button');
                if (submit) (submit as Button).disabled = Boolean(newV);
                break;

            case 'fields':
                this._renderRows();
                break;

            default:
                break;
        }
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

        if (showErrors) this._updateRowErrors();
        return valid;
    }


    // Ordered array of field names currently in the form's fields
    private get _fieldOrder(): string[] {
        return this.fields.map(f => {
            if (f.type === 'submit') return 'submit';
            return f.name;
        });
    }


    // Get array of zen-ui-form-rows
    private get _rows(): FormRow[] {
        return Array.from(this._root.querySelectorAll('zen-ui-form-row'));
    }


    // Update the values of each form row
    private _updateValues(values: FormValues) {
        if (this._updatingValues) return;
        this._updatingValues = true;


        if (this._validateOnChange) this.validate(this._showErrors);

        this._rows.forEach(r => {
            if (values[r.name as string] !== r.value) r.value = values[r.name as string];
        });

        this.trigger('change', this.values, true);
        this._updatingValues = false;
    }


    // Update the errors on each form row
    private _updateRowErrors() {
        this._rows.forEach(r => {
            // If errors for this field, set to the first error
            const errors = (this._fieldErrors || {})[r.name as string];
            if (errors && this._showErrors) r.error = errors[Object.keys(errors)[0]];
            else r.error = null;
        });
    }


    // Update the main error for the form
    private _updateError() {
        const err = this._root.querySelector('.main-error') as HTMLSpanElement;
        if (err) err.style.display = !this.error ? 'none' : '';
    }


    // Create or update each row in the fields property
    private _renderRows() {
        // Loop over each field and either update the existing row, or
        // create a new one
        this.fields.forEach(f => {
            // Attempt to update an existing row/field or create a new one
            if (!this._updateExistingRow(f)) this._createRow(f);
        });

        this._reorderRows();
    }


    // Update an existing row with a Field, otherwise return false
    private _updateExistingRow(f: Field): boolean {
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
            if (['radio-icons', 'select'].includes(f.type)) {
                existing.field = f;
                existing.update();
            }

            if (this._showErrors && errors) {
                existing.error = errors[Object.keys(errors)[0]];
            } else existing.error = null;

            existing.hidden = Boolean(f.hidden);

            return true;
        }

        return false;
    }


    // Create a new row based on a Field
    private _createRow(f: Field): FormRow | false | void {
        if (!this.form) return this._error('Not initialised');
        if (f.hidden) return false;

        const row = document.createElement('zen-ui-form-row') as FormRow;
        row.setAttribute('name', f.type === 'submit' ? 'submit' : f.name);

        row.field = f;

        row.addEventListener('change', (e: CustomEventInit) => {
            // tslint:disable-next-line
            if ((e.detail || e.detail === false) && e.detail != this.values[f.name]) {
                this.values = {
                    ...this.values,
                    ...{[f.name]: e.detail}
                };
            }
        });
        this.form.appendChild(row as HTMLElement);
        row.setAttribute('type', f.type);

        row.addEventListener('submit', this.submit.bind(this));
        return row;
    }


    // Reorder the form rows based on the fields property
    private _reorderRows() {
        const f = this.form;
        if (f) {
            const children = Array.from(f.children);
            const order = this._fieldOrder;


            // If the order and the existing field order don't match, reorder
            if (!isEqual(order, children.map(el => el.getAttribute('name')))) {
                children
                    .map((el): [number, FormRow] => [
                        order.indexOf(el.getAttribute('name') || ''),
                        f.removeChild(el) as FormRow
                    ])
                    .sort((prev, next) => {
                        if (prev[0] < next[0]) return -1;
                        if (prev[0] > next[0]) return 1;
                        return 0;
                    })
                    .forEach(el => f.appendChild(el[1] as HTMLElement));
            }
        }
    }
}

window.customElements.define('zen-ui-form', Form);
