import { ZenInputDropdown } from '@origami/zen-input-dropdown';
import { dispatchChange } from '@origami/zen-lib/decorators';
import { FieldOption, FieldOptions } from '@origami/zen-lib/FormValidator';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import CSS from './select-css';

export interface SelectProps {
  options: FieldOptions;
  value: string | null;
  name?: string;
  placeholder?: string;
  _open?: boolean;
}

@customElement('zen-select')
@dispatchChange()
export class ZenSelect extends LitElement implements SelectProps {
  @property()
  public options: FieldOptions = [];

  @property()
  public value: string | null = null;

  @property()
  public name?: string;

  @property()
  public placeholder?: string;

  @property()
  public _open?: boolean;

  public render() {
    const { value, placeholder, options, _open } = this;

    let v;
    if (value) {
      if (options instanceof Array) {
        v = (options as FieldOption[]).find(({ value: v }) => v === value);
        if (v) v = v.label;
        if (!v && (options as string[]).includes(value)) v = value;
      } else v = options[value];
    }

    return html`
      ${CSS}
      <div @click="${() => (this._open = !this._open)}">
        <div class="value">
          ${ v || html`<span class="placeholder">${placeholder}</span>` }
        </div>

        <zen-icon
          type="arrow-down"
          color="grey-200"
          class="${_open ? 'rotate' : ''}"
        ></zen-icon>
      </div>

      <zen-input-dropdown
        .options="${options}"
        .value="${value}"
        @change="${
          (e: { target: ZenInputDropdown }) =>
            (this.value = e.target.value || null)
        }"
        .open="${_open}"
        @toggle="${
          (e: { target: ZenInputDropdown }) => (this._open = e.target.open)
        }"
      ></zen-input-dropdown>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-select': ZenSelect;
  }
}
