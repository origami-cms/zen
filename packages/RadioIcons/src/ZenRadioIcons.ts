import { dispatchChange } from '@origami/zen-lib/decorators';
import { FieldRadioIconsOption } from '@origami/zen-lib/FormValidator';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import CSS from './radio-icons-css';

export interface RadioIconsProps {
  options: FieldRadioIconsOption[];
  value: string | number | null;
  name?: string;
  columns?: number;
}

@customElement('zen-radio-icons')
@dispatchChange()
export class ZenRadioIcons extends LitElement implements RadioIconsProps {
  @property()
  public options: FieldRadioIconsOption[] = [];

  @property()
  public value: string | number | null = null;

  @property()
  public name?: string;

  @property()
  public columns?: number;

  public updated(p: any) {
    super.updated(p);

    const columns = p.get('columns');
    if (columns) {
      this.style.setProperty(
        '--radio-icons-columns',
        `var(--radio-icons-columns-override, ${columns})`
      );
    }
  }

  public render() {
    const { value, options } = this;

    return html`
      ${CSS}
      <ul class="options">
        ${
          options.map(
            (o) => html`
              <li
                class="option ${o.value === value ? 'active' : ''}"
                @click="${() => (this.value = o.value)}"
              >
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
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-radio-icons': ZenRadioIcons;
  }
}
