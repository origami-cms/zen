import {LitElement} from '@polymer/lit-element';
import {html} from 'lit-html/lib/lit-extended';
import {component, property} from 'polymer3-decorators/dist';
import {bindAttributes, dispatchChange} from '../../util/decorators';
import CSS from './input-css';
import { TemplateResult } from 'lit-html';

export interface props {
    placeholder?: string;
    name?: string;
    type: string;
    icon?: string;
    loading?: boolean;
    value?: string;
    disabled?: string;
}

@component('zen-input')
@bindAttributes
@dispatchChange()
export default class Input extends LitElement implements props {

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
    value?: string;

    @property
    disabled?: string;

    static _boundAttributes = [
        'placeholder', 'name', 'type', 'icon', 'loading', 'disabled'
    ];


    _render({icon, loading, type, placeholder, disabled, value}: props): TemplateResult {
        return html`
            ${CSS}
            ${icon
                ? html`<zen-icon type="${icon}" color="grey-300"></zen-icon>`
                : ''
            }

            <input
                value="${value}"
                type="${type}"
                placeholder="${placeholder}"
                disabled="${disabled}"
                on-input="${this._handleInput.bind(this)}"
            />

            ${loading
                ? html`<zen-loading></zen-loading>`
                : ''
            }
        `;
    }

    private _handleInput(e: Event) {
        this.value = (e.target as HTMLInputElement).value;
    }
}
