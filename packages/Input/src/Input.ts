import {html, LitElement} from '@polymer/lit-element';

import {component, property, bindAttributes, dispatchChange} from '@origamijs/zen-lib/lib/decorators';
import CSS from './input-css';
import { TemplateResult } from 'lit-html';

export interface InputProps {
    placeholder?: string;
    name?: string;
    type: string;
    icon?: string;
    loading?: boolean;
    value: string | null;
    disabled?: string;
}

@component('zen-input')
@bindAttributes
@dispatchChange()
export class Input extends LitElement implements InputProps {

    @property
    placeholder?: string;

    @property
    name?: string;

    @property
    type: string = 'text';

    @property
    icon?: string;

    @property
    loading?: boolean;

    @property
    value: string | null = null;

    @property
    disabled?: string;

    static _boundAttributes = [
        'placeholder', 'name', 'type', 'icon', 'loading', 'disabled'
    ];

    constructor() {
        super();
        this._handleInput = this._handleInput.bind(this);
    }


    render(): TemplateResult {
        const { icon, loading, type, placeholder, disabled, value } = this;
        const v = value || '';

        return html`
            ${CSS}
            ${icon
                ? html`<zen-icon type="${icon}".color="grey-300"></zen-icon>`
                : ''
            }

            <input
                .value="${v}"
                type="${type}"
                placeholder="${placeholder}"
                .disabled="${disabled}"
                @input="${this._handleInput}"
            />

            ${loading
                ? html`<zen-loading></zen-loading>`
                : ''
            }
        `;
    }


    focus() {
        this.shadowRoot!.querySelector('input')!.focus();
    }


    private _handleInput(e: Event) {
        this.value = (e.target as HTMLInputElement).value;
    }
}
