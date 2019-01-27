import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
// @ts-ignore
import { installRouter } from 'pwa-helpers/router';

export interface LinkProps {
  href?: string;
}

@customElement('zen-link')
// @bindAttributes
export class ZenLink extends LitElement implements LinkProps {
  @property()
  public href?: string;

  // static _boundAttributes = ['href'];

  public connectedCallback() {
    const time = 3; // Time to delay sending pop state

    super.connectedCallback();

    this.addEventListener('click', () => {
      if (this.href && window.location.pathname !== this.href) {
        setTimeout(() => {
          dispatchEvent(new PopStateEvent('popstate', { state: {} }));
        }, time);
        window.history.pushState({}, '', this.href);
      }
    });
  }

  public firstUpdated() {
    installRouter(this._updateClass.bind(this));
  }

  public render() {
    return html`
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
        }
      </style>
      <slot></slot>
    `;
  }

  public _updateClass(l: Location) {
    let active = l.pathname === this.href;
    if (!active) active = l.pathname === `${this.href}/`;
    this.classList.toggle('active', active);
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-link': ZenLink;
  }
}
