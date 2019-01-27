import { dispatchChange } from '@origami/zen-lib/decorators';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import CSS from './radio-css';

export interface RadioProps {
  options: { [key: string]: string };
  value: string | null;
  name?: string;
}

@customElement('zen-radio')
@dispatchChange()
export class ZenRadio extends LitElement implements RadioProps {
  @property()
  public options = {};

  @property()
  public value: string | null = null;

  @property()
  public name?: string;

  public render() {
    const { value, options } = this;

    const opts = Object.entries(options).map(([v, label]) => ({
      value: v,
      label
    }));

    return html`
      ${CSS}
      <div class="options">
        ${
          opts.map((o) => {
            return html`
              <div class="option" @click="${() => (this.value = o.value)}">
                <zen-icon
                  type="${
                    value === o.value ? 'radio-checked' : 'radio-unchecked'
                  }"
                ></zen-icon>
                <span>${o.label}</span>
              </div>
            `;
          })
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-radio': ZenRadio;
  }
}
