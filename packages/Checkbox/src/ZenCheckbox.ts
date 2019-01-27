import { dispatchChange } from '@origami/zen-lib/decorators';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import { TemplateResult } from 'lit-html';
import CSS from './checkbox-css';

export interface CheckboxProps {
  name?: string;
  size?: string;
  checked: boolean;
}

// @ts-ignore
@customElement('zen-checkbox')
@dispatchChange('checked')
export class ZenCheckbox extends LitElement implements CheckboxProps {
  @property()
  public name?: string;

  @property()
  public size?: string;

  @property()
  public checked: boolean = false;

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
  }

  public render() {
    const checked = this.checked ? 'checked' : '';
    return html`
      ${CSS}
      <label class="checkbox ${checked}">
        <input
          type="checkbox"
          .checked="${this.checked}"
          @change="${this._handleChange}"
        />
        <span class="check"></span>
      </label>
    `;
  }

  private _handleChange(e: Event) {
    const newVal = (e.target as HTMLInputElement).checked;
    if (newVal !== this.checked) this.checked = newVal;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-checkbox': ZenCheckbox;
  }
}
