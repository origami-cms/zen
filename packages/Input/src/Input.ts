import { dispatchChange } from '@origamijs/zen-lib/lib/decorators';
import { customElement, html, LitElement, property } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import CSS from './input-css';


// @ts-ignore
@customElement('zen-input')
@dispatchChange()
export class Input extends LitElement {

    @property({reflect: true, type: String})
    placeholder?: string | null;

    @property({reflect: true, type: String})
    name?: string | null;

    @property({reflect: true})
    type?: string;

    @property({reflect: true, type: String})
    icon?: string;

    @property({reflect: true, type: Boolean})
    loading?: boolean;

    @property()value: string | null = null;    @property({reflect: true, type: Boolean})
    disabled?: boolean;

    constructor() {
        super();
        this._handleInput = this._handleInput.bind(this);
    }


    render(): TemplateResult {
        const { icon, loading, type, placeholder, disabled, value } = this;

        const v = value || '';

        return html`
            ${CSS}
            ${icon ? html`<zen-icon type="${icon}".color="grey-300"></zen-icon>` : ''}

            <input
                .value=${v}
                .type=${type}
                placeholder=${ifDefined(placeholder)}
                .disabled=${disabled}
                @input=${this._handleInput}
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
