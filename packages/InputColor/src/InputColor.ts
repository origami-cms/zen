import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { component, property } from '@origamijs/zen-lib/lib/decorators';
import CSS from './input-color-css';


export interface InputColorProps {
    value: string | null;
    placeholder: string | null;
}

@component('zen-input-color')
export class InputColor extends LitElement implements InputColorProps {
    @property
    value: string | null = null;
    @property
    placeholder: string | null = null;

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this);
    }

    render() {
        const { value, placeholder } = this;

        return html`
            ${CSS}
            <div class="color" style="background-color: ${value}">
                <zen-icon type="eyedropper".color="${value ? 'white' : 'grey-300'}"></zen-icon>
            </div>
            <span>${value || placeholder || ''}</span>
            <input type="color" @change=${this._handleChange}>
        `;
    }

    private _handleChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.value = input.value;
        this.dispatchEvent(new CustomEvent('change'));
    }
}
