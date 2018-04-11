import Element from '../../lib/Element';
import HTML from './form.html';
import CSS from './form.scss';
import {isEqual} from 'lodash';


import Icon from '../Icon';
import Checkbox from './Checkbox';
import RadioIcons from './RadioIcons';
import Select from './Select';

export {default as Checkbox} from './Checkbox';
export {default as RadioIcons} from './RadioIcons';
export {default as Select} from './Select';


import {ValidatorRules} from './Validator/rules';
import Validator, {ValidateFieldErrors, ValidationErrors} from './Validator/Validator';

import {Field, FieldMixinIcon} from './FieldTypes';
import {Button} from '..';
export {Field} from './FieldTypes';


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
            if (!isEqual(order, children.map(el => el.getAttribute('data-name')))) {
                children
                    .map((el): [number, HTMLElement] => [
                        order.indexOf(el.getAttribute('data-name') || ''),
                        this.form.removeChild(el) as HTMLElement
                    ])
                    .sort((prev, next) => {
                        if (prev[0] < next[0]) return -1;
                        if (prev[0] > next[0]) return 1;
                        return 0;
                    })
                    .forEach(el => this.form.appendChild(el[1]));
            }
        }

        this.updateError();
    }

    private _updateExistingRow(f: Field, v: any): boolean {
        let errors: false | ValidationErrors = false;
        if (this._fieldErrors) errors = this._fieldErrors[f.name];


        // Attempt to find an existing element...
        let existing = this._root.querySelector(`*[name='${f.name}']`) as HTMLInputElement;

        if (!existing && f.type === 'submit') {
            existing = this._root.querySelector('.submit-button') as HTMLInputElement;
        }

        // If there is an existing element, update it's value, then continue
        // to next field
        if (existing) {
            existing.value = v;
            if (f.type === 'submit') existing.value = f.value || 'Submit';
            // @ts-ignore
            if (f.type === 'select') existing.options = f.options;
            if (this._showErrors) existing.classList.toggle('error', Boolean(errors));

            const existingRow = this._root.querySelector(
                `.form-row[data-name='${f.name}']`
            ) as HTMLElement | null;

            if (this._showErrors && existingRow) {
                const errorSpan = (existingRow as HTMLElement).querySelector('span.error') as HTMLSpanElement;
                errorSpan.style.display = errors ? '' : 'none';
                if (errors) {
                    errorSpan.innerHTML = '';
                    errorSpan.appendChild(this._renderTemplate('error', {
                        error: errors[Object.keys(errors)[0]]
                    }));
                }
            }

            if (existingRow) existingRow.style.display = f.hidden ? 'none' : '';

            return true;
        }

        return false;
    }


    private _createRow(f: Field, v: any): HTMLElement | false {
        if (f.hidden) return false;


        // Create a new form row from the template
        const row = document.importNode(
            this.templates['form-row'],
            true
        ).querySelector('div') as HTMLDivElement;
        row.setAttribute('data-name', f.type === 'submit' ? 'submit' : f.name);

        const field = this._createField(f, v);
        if (!field) return false;

        const icon = row.querySelector('zen-ui-icon') as Icon;
        const _f = f as FieldMixinIcon;
        if (_f.icon) {
            icon.type = _f.icon;
            icon.color = _f.iconColor || 'grey-300';
        } else icon.remove();

        if (field instanceof Array) {
            field.forEach(f => row.appendChild(f));
        } else row.appendChild(field);
        this.form.appendChild(row);

        return row;
    }


    private _createField(f: Field, v: any): HTMLElement | HTMLElement[] | false {
        let field: any = document.createElement('input');

        const change = () => {
            let v: any = field.value;

            if (f.type === 'checkbox') v = field.checked;

            this.values = {
                ...this.values,
                ...{[f.name]: v}
            };
        };

        const {type} = f;


        switch (f.type) {
            case 'textarea':
                field = document.createElement('wc-wysiwyg');
                field.name = f.name;
                field.addEventListener('keyup', change);

                // TODO: Wait for ready
                setTimeout(() => {
                    field.value = v;
                }, 10);
                break;

            // HACK: To get the placeholder working
            case 'date':
                field.value = v;
                field.name = f.name;
                field.type = 'text';
                field.addEventListener('keyup', change);
                if (f.placeholder) field.placeholder = f.placeholder;
                field.addEventListener('focus', () => field.type = 'date');
                field.addEventListener('blur', () => {
                    if (!field.value) field.type = 'text';
                });

                break;


            case 'text':
            case 'input':
            case 'password':
            case 'email':
            case 'number':
                field.value = v;
                field.name = f.name;
                field.type = f.type;
                field.addEventListener('keyup', change);
                if (f.placeholder) field.placeholder = f.placeholder;
                break;


            case 'submit':
                field = document.createElement('zen-ui-button') as Button;
                field.classList.add('submit-button');
                field.innerHTML = f.value || 'Submit';
                field.addEventListener('click', this.submit.bind(this));
                if (f.color) field.color = f.color;
                break;


            case 'select':
                field = document.createElement('zen-ui-select') as Select;
                if (f.name) field.setAttribute('name', f.name);
                field.shadowRoot.addEventListener('change', change);
                if (f.placeholder) field.placeholder = f.placeholder;
                if (f.options) field.options = f.options;

                break;


            case 'checkbox':
                field = document.createElement('zen-ui-checkbox') as Checkbox;
                if (f.name) field.setAttribute('name', f.name);
                (field.shadowRoot).addEventListener('change', change);

                if (f.label) {
                    const label = document.createElement('span');
                    label.innerHTML = f.label;
                    return [field, label];
                }
                break;


            case 'radio-icons':
                field = document.createElement('zen-ui-radio-icons') as RadioIcons;
                field.options = f.options;
                if (f.name) field.setAttribute('name', f.name);
                (field.shadowRoot).addEventListener('change', change);
                break;


            // TODO: Custom web component fields
            default:
                this._warn(`Field type '${type}' is not supported`);

                return false;
        }

        return field;
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
