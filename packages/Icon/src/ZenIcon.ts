import { customElement, html, LitElement, property } from 'lit-element';
import { until } from 'lit-html/directives/until';
import CSS from './icon-css';

export interface IconProps {
  type?: string;
  color?: string;
  size?: string;
}
@customElement('zen-icon')
export class ZenIcon extends LitElement implements IconProps {

  @property({attribute: true})
  public type?: string;

  @property({attribute: true})
  public color?: string = 'main';

  @property({attribute: true})
  public size?: string = 'main';

  public render() {
    const { color } = this;

    const children = this._symbol;

    return html`
      ${CSS}
      <style>
        zen-icon {
          display: none;
        }
      </style>
      <svg
        viewBox="0 0 40 40"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        style="pointer-events: none; display: block; width: 100%; height: 100%;"
        class="${color}"
      >
        ${until(children, 'ok')}
      </svg>
    `;
  }

  private get _symbol() {
    if (!this.type) return Promise.resolve([]);
    return new Promise(async (res) => {
      await window.customElements.whenDefined('zen-icon-set');
      let newIcon = document.querySelector(`#zen-icon-${this.type}`);

      if (!newIcon) {
        console.error(`Icon ${this.type} not found`);
        return [];
      }
      newIcon = newIcon.cloneNode(true) as SVGSymbolElement;

      res(Array.from(newIcon.children));
    });
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-icon': ZenIcon;
  }
}
