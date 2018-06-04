import {LitElement} from '@polymer/lit-element';
import {component, observe, property} from 'polymer3-decorators/dist';
import {bindAttributes, style} from 'util/decorators';
import CSS from './input-css';
import {html} from 'lit-html/lib/lit-extended';

@component('zen-input')
@bindAttributes
export default class Input extends LitElement {

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

    // tslint:disable-next-line function-name
    _render({icon, loading, type, placeholder, disabled, value}: {[key in keyof Input]: any}) {
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
