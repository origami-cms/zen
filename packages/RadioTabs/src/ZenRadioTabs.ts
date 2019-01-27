import { dispatchChange } from '@origami/zen-lib/decorators';
import { FieldOption, FieldOptions } from '@origami/zen-lib/FormValidator';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import CSS from './radio-tabs-css';

export interface RadioTabsProps {
  options: FieldOptions;
  value: string | number | null;
  name?: string;
}

@customElement('zen-radio-tabs')
@dispatchChange()
export class ZenRadioTabs extends LitElement implements RadioTabsProps {
  @property()
  public options: FieldOptions = [];

  @property()
  public value: string | number | null = null;

  @property()
  public name?: string;

  public render() {
    const { options, value } = this;

    let opts: FieldOptions = [];
    if (options) {
      if (options instanceof Array) {
        opts = options;
        if (typeof opts[0] === 'string') {
          opts = (opts as string[]).map((o: string) => ({
            value: o,
            label: o
          }));
        }
      } else {
        opts = Object.entries(options).map(([value, label]) => ({
          value,
          label
        }));
      }
    }

    return html`
      ${CSS}
      ${
        (opts as FieldOption[]).map(
          (o) => html`
            <div
              class="tab ${value === o.value ? 'active' : ''}"
              @click="${() => (this.value = o.value)}"
            >
              <span>${o.label}</span>
            </div>
          `
        )
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-radio-tabs': ZenRadioTabs;
  }
}
