import { dispatchChange } from '@origami/zen-lib/decorators';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import CSS from './input-css';

@customElement('zen-input')
@dispatchChange()
export class ZenInput extends LitElement {
  @property({ reflect: true, type: String })
  public placeholder?: string | null;

  @property({ reflect: true, type: String })
  public name?: string | null;

  @property({ reflect: true })
  public type?: string;

  @property({ reflect: true, type: String })
  public icon?: string;

  @property({ reflect: true, type: Boolean })
  public loading?: boolean;

  @property()
  public value: string | null = null;
  @property({ reflect: true, type: Boolean })
  public disabled?: boolean;

  constructor() {
    super();
    this._handleInput = this._handleInput.bind(this);
  }

  public render() {
    const { icon, loading, type, placeholder, disabled, value } = this;

    const v = value || '';

    return html`
      ${CSS}
      ${
        icon
          ? html`
              <zen-icon type="${icon}" .color="grey-300"></zen-icon>
            `
          : ''
      }

      <input
        .value="${v}"
        .type="${type}"
        placeholder="${ifDefined(placeholder)}"
        .disabled="${disabled}"
        @input="${this._handleInput}"
      />

      ${
        loading
          ? html`
              <zen-loading></zen-loading>
            `
          : ''
      }
    `;
  }

  public focus() {
    this.shadowRoot!.querySelector('input')!.focus();
  }

  private _handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-input': ZenInput;
  }
}
