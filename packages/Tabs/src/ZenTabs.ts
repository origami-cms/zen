import { bindAttributes } from '@origami/zen-lib/decorators';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import CSS from './tabs-css';

export interface Tab {
  icon?: string;
  text?: string;
  disabled?: boolean;
}

export interface TabPanelsProps {
  tabs: Tab[];
}

@customElement('zen-tabs')
@bindAttributes
export class ZenTabs extends LitElement implements TabPanelsProps {
  public static _boundAttributes = ['noexpand'];

  @property()
  public tabs: Tab[] = [];

  @property()
  public noexpand: boolean = false;

  get active() {
    return this._active;
  }
  set active(v: number) {
    if (this._active === v) return;

    this._active = v;
    (Array.from(this.children) as HTMLElement[]).forEach((c, i) => {
      if (v === i) c.removeAttribute('hidden');
      else c.setAttribute('hidden', 'hidden');
    });
  }
  @property()
  private _active: number = -1;

  public connectedCallback() {
    super.connectedCallback();
    this.active = 0;
  }

  public render() {
    return html`
      ${CSS}
      <ul class="tabs">
        ${
          this.tabs.map(
            (t, i) => html`
              <li
                class="tab ${this.active === i ? 'active' : ''} ${
                  t.disabled ? 'disabled' : ''
                }"
                @click="${() => (this.active = i)}"
              >
                ${
                  t.icon
                    ? html`
                        <zen-icon type="${t.icon}"></zen-icon>
                      `
                    : null
                }
                ${
                  t.text
                    ? html`
                        <span>${t.text}</span>
                      `
                    : null
                }
              </li>
            `
          )
        }
      </ul>

      <div class="panels"><slot></slot></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-tabs': ZenTabs;
  }
}
