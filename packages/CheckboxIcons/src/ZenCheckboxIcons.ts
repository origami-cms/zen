import { FieldCheckboxIconsOption } from '@origami/zen-lib/FormValidator';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import { TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import CSS from './checkbox-icons-css';

export interface CheckboxIconsProps {
  options: FieldCheckboxIconsOption[];
  value: (string | number)[];
  name?: string;
  columns?: number;
}

// @ts-ignore
@customElement('zen-checkbox-icons')
export class ZenCheckboxIcons extends LitElement implements CheckboxIconsProps {
  @property()
  public options: FieldCheckboxIconsOption[] = [];

  @property()
  public value: (string | number)[] = [];

  @property()
  public name?: string;

  @property()
  public columns?: number;

  public updated(p: any) {
    super.updated(p);
    const columns = p.get('columns');
    if (p && columns) {
      this.style.setProperty(
        '--radio-icons-columns',
        `var(--radio-icons-columns-override, ${columns})`
      );
    }
  }

  public render() {
    let { value, options } = this;
    value = value || [];

    return html`
      ${CSS}
      <ul class="options">
        ${
          options.map(
            (o) => html`
              <li
                class="option ${value.includes(o.value) ? 'active' : ''}"
                @click="${() => this._toggle(o.value)}"
              >
                <zen-checkbox
                  .checked="${value.includes(o.value)}"
                  @click="${(e: Event) => this._handleCheckbox(e, o.value)}"
                ></zen-checkbox>
                <div class="img">
                  ${
                    o.icon
                      ? html`
                          <zen-icon .type="${o.icon}"></zen-icon>
                        `
                      : ''
                  }
                  ${
                    o.image
                      ? html`
                          <img .src="${o.image}" />
                        `
                      : ''
                  }
                  ${
                    o.html
                      ? html`
                          ${unsafeHTML(o.html)}
                        `
                      : ''
                  }
                </div>
                <span>${o.label}</span>
              </li>
            `
          )
        }
      </ul>
    `;
  }

  // Fixes bug with double trigger
  private _handleCheckbox(e: Event, value: string | number) {
    e.preventDefault();
    e.stopPropagation();
    this._toggle(value);
  }

  private _toggle(v: string | number) {
    const val = this.value || [];

    if (!val.includes(v)) {
      val.push(v);
      this.value = val;
    } else this.value = val.filter((_v) => v !== _v);

    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('change'));
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-checkbox-icons': ZenCheckboxIcons;
  }
}
