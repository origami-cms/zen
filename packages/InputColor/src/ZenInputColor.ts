import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import CSS from './input-color-css';

export interface InputColorProps {
  value: string | null;
  placeholder: string | null;
}

@customElement('zen-input-color')
export class ZenInputColor extends LitElement implements InputColorProps {
  @property()
  public value: string | null = null;
  @property()
  public placeholder: string | null = null;

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
  }

  public render() {
    const { value, placeholder } = this;

    return html`
      ${CSS}
      <div class="color" style="background-color: ${value}">
        <zen-icon
          type="eyedropper"
          .color="${value ? 'white' : 'grey-300'}"
        ></zen-icon>
      </div>
      <span>${value || placeholder || ''}</span>
      <input type="color" @change="${this._handleChange}" />
    `;
  }

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent('change'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-input-color': ZenInputColor;
  }
}
