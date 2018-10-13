// tslint:disable function-name

import { html, LitElement } from '@polymer/lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { TemplateResult } from 'lit-html';
import { FormRow } from '@origamijs/zen-form-row';

import { Field, FormValues } from '@origamijs/zen-lib/lib/FormValidator/FormFieldTypes';
import Validator, { ValidateFieldErrors } from '@origamijs/zen-lib/lib/FormValidator/Validator';
import CSS from './form-css';
import { component, property } from '@origamijs/zen-lib/lib/decorators';


@component('zen-form')
export class Form extends LitElement {
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

    private _validateOnChange: boolean = false;
    private _showErrors: boolean = false;

    private _eventMap: WeakMap<Element, Function> = new WeakMap();

    constructor() {
        super();
        this.submit = this.submit.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    render(): TemplateResult {

        return html`
             ${CSS} ${this.error ? html`
            <div class="error">
                <zen-icon type="error" .color="error"></zen-icon>
                <span>${this.error}</span>` : '' }
                <form novalidate @submit="${this.submit}">
                    ${this._children}
                </form>
        `;
    }


    private get _isChildren() {
        return this.fields.length === 0;
    }


    private get _children(): TemplateResult {
        const errors = this.fieldErrors || {};

        // Using this.fields mapped to <form-row>'s
        if (!this._isChildren) {
            return html`${repeat(
                this.fields,
                f => f.name,
                f => html`<zen-form-row
                    .field=${f}
                    .value=${this.values[f.name]}
                    @change=${this._handleChange}
                    @submit=${this.submit}
                    .name=${f.name}
                    .error=${errors[f.name]}
                    .rowwidth=${f.width}
                    .disabled=${f.disabled}
                ></zen-form-row>`
            )}`;

        // Use slotted children
        } else {
            return html`<slot @slotchange=${() => this.requestUpdate()}></slot>`;
        }
    }


    // Query all slotted children with 'name' attributes
    private get _slottedControls(): Element[] | false {
        const s = this.shadowRoot!.querySelector('slot');
        if (!this._isChildren || !s) return false;
        const nodes = s.assignedNodes().filter(n => n.nodeType === 1) as Element[];

        return nodes.reduce((controls, node) => {
            if (node.hasAttribute('name')) controls.push(node);
            controls.push(
                ...Array.from(node.querySelectorAll('*[name]'))
            );
            return controls;
        }, [] as Element[]);
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

        const { valid, fields } = v.validate(this.values);

        if (fields) {
            this.fieldErrors = fields;
            const row = this.scrollToError();
            if (row) row.focus();
        }

        this.dispatchEvent(new CustomEvent('validated', {
            detail: { valid }
        }));

        return valid;
    }


    updated(p: any) {
        super.updated(p);
        const controls = this._slottedControls;

        if (p && p.get('values')) {
            if (this._showErrors) this.validate();
            this.dispatchEvent(new CustomEvent('change'));

            // Updates the slotted children
            if (controls) {
                controls.forEach(c => {
                    const i = c as HTMLInputElement;
                    // Lookup the value to change based on the element type
                    const vName = this._getValueNameFromElement(i);
                    // Update the element's value if it's different from form value
                    if (
                        i[vName] !== this.values[i.name] &&
                        this.values[i.name] !== undefined
                    ) i[vName] = this.values[i.name];
                });
            }

        // Adds the event listeners to the slotted children
        } else if (this._isChildren) {
            if (controls) {
                controls.forEach(c => {
                    if (this._eventMap.has(c)) return;
                    c.addEventListener('change', this._handleChange);
                    this._eventMap.set(c, this._handleChange);
                });
            }
            // TODO: clear the map
        }
    }


    private _handleChange(e: Event) {
        const t = e.target as HTMLInputElement;
        const v = t[this._getValueNameFromElement(t)];

        // @ts-ignore
        if (this.values[e.target.name] === v) return false;
        // @ts-ignore
        this.values = { ...this.values, ...{ [e.target.name]: v } };
    }


    // Get the value of the input based off the input type
    private _getValueNameFromElement(e: HTMLInputElement) {
        if (
            e.tagName === 'ZEN-CHECKBOX' ||
            (e.tagName === 'INPUT' && e.type === 'checkbox')
        ) return 'checked';

        else return 'value';
    }
}

