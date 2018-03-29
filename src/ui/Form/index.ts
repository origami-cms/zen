import Element from '../../lib/Element';
import HTML from './form.html';
import CSS from './form.scss';
import * as _ from 'lodash';


import './Checkbox';
import Icon from '../Icon';


export type FieldType = 'text' | 'submit' | 'textarea' | 'input' | 'password' | 'email';


export interface Field {
    name: string;
    type: FieldType;
    value?: any;
    icon?: string;
    iconColor?: string;
    placeholder?: string;
    color?: string;
}


export default class Form extends Element {
    form: HTMLFormElement;
    error: string | null = null;
    values: {[key: string]: any} = {};
    fields: Field[] = [];

    constructor() {
        super(HTML, CSS.toString(), 'Form');

        this.form = this._root.querySelector('form') as HTMLFormElement;
    }

    connectedCallback() {
        super.connectedCallback();
        this.form.addEventListener('submit', this.submit.bind(this));
    }

    static get boundProps() {
        return ['fields', 'values', 'error'];
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

    // attributeChangedCallback(attr: keyof ZenForm, oldV: string, newV: string): void {
    //     switch (attr) {
    //         case 'fields':
    //             this[attr] = newV;
    //     }
    // }

    async propertyChangedCallback(prop: string, oldV: string, newV: string): Promise<void> {
        await this.ready();
        switch (prop) {
            case 'error':
                this.updateError();
                break;

            default:
                break;
        }
    }

    updateError() {
        const err = this._root.querySelector('.error');
        if (err) err.classList.toggle('hide', !this.error);
    }


    render() {
        super.render();

        // Loop over each field and either update the existing row, or
        // create a new one
        this.fields.forEach(f => {
            const v = this.values[f.name] || '';

            // Attempt to update an existing field or create a new one
            if (!this._updateExistingRow(f, v)) this._createField(f, v);
        });


        // Reorder the form rows based on the fields property
        if (this.form) {
            const children = Array.from(this.form.children);
            const order = this._fieldOrder;

            // If the order and the existing field order don't match, reorder
            if (!_.isEqual(order, children.map(el => el.getAttribute('data-name')))) {
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
        // Attempt to find an existing element...
        let existing = this._root.querySelector(`*[name='${f.name}'`) as HTMLInputElement;
        if (!existing && f.type === 'submit') {
            existing = this._root.querySelector('*[type="submit"]') as HTMLInputElement;
        }

        // If there is an existing element, update it's value, then continue
        // to next field
        if (existing) {
            existing.value = v;
            if (f.type === 'submit') existing.value = f.value || 'Submit';

            return true;
        }

        return false;
    }


    private _createRow(f: Field, v: any): HTMLElement | false {
        // Create a new form row from the template
        const row = document.importNode(
            this.templates['form-row'],
            true
        ).querySelector('div') as HTMLDivElement;
        row.setAttribute('data-name', f.type === 'submit' ? 'submit' : f.name);

        const field = this._createField(f, v);
        if (!field) return false;

        const icon = row.querySelector('zen-ui-icon') as Icon;
        if (f.icon) {
            icon.type = f.icon;
            icon.color = f.iconColor || 'shade-5';
        } else icon.remove();

        row.appendChild(field);
        this.form.appendChild(row);

        return row;
    }


    private _createField(f: Field, v: any): HTMLElement | false {
        let field: any = document.createElement('input');

        const keyup = () => {
            this.values = {
                ...this.values,
                ...{[f.name]: field.value}
            };
        };

        switch (f.type) {
            // Case 'textarea':
            // field = document.createElement('textarea');
            // field.value = v;
            // field.name = f.name;
            // field.addEventListener('keyup', keyup);
            // break;

            case 'textarea':
                field = document.createElement('wc-wysiwyg');
                field.name = f.name;
                field.addEventListener('keyup', keyup);

                // TODO: Wait for ready
                setTimeout(() => {
                    field.value = v;
                }, 10);
                break;

            case 'text':
            case 'input':
            case 'password':
            case 'email':
                field.value = v;
                field.name = f.name;
                field.type = f.type;
                field.addEventListener('keyup', keyup);
                field.placeholder = f.placeholder;
                break;

            case 'submit':
                field.type = f.type;
                field.value = f.value || 'Submit';
                if (f.color) field.classList.add(f.color);
                break;

            default:
                console.warn(`Field type '${f.type}' is not supported`);

                return false;
        }

        return field;
    }


    submit(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent('submit', false, false, {});
        this.dispatchEvent(event);

        return false;
    }
}

window.customElements.define('zen-ui-form', Form);
