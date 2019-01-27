import { customElement, html, LitElement, property } from 'lit-element';
import { } from 'lit-element/lib/decorators';
import CSS from './button-css';

export interface ButtonProps {
  size?: string;
  icon?: string | boolean;
  iconright?: boolean;
  hollow?: boolean;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * The button element is a styled button with options of
 * adding an icon, loading state, and size.
 */
@customElement('zen-button')
// @bindAttributes
export class ZenButton extends LitElement implements ButtonProps {
  // private static _boundAttributes = [
  //   'hollow',
  //   'color',
  //   'iconright',
  //   'icon',
  //   'disabled',
  //   'size',
  //   'loading'
  // ];

  @property({type: String, attribute: true, reflect: true})
  public size?: string;

  @property({type: String, attribute: true, reflect: true})
  public icon?: string | boolean;

  @property({type: Boolean, attribute: true, reflect: true})
  public iconright?: boolean;

  @property({type: Boolean, attribute: true, reflect: true})
  public hollow?: boolean;

  @property({type: String, attribute: true, reflect: true})
  public color?: string;

  @property({type: Boolean, attribute: true, reflect: true})
  public disabled?: boolean;

  @property({type: Boolean, attribute: true, reflect: true})
  public loading?: boolean;

  public render() {
    const { icon, size, loading, _iconColor } = this;

    return html`
      ${CSS}
      ${
        loading
          ? html`
              <zen-loading></zen-loading>
            `
          : ''
      }
      ${
        icon && !loading
          ? html`
              <zen-icon
                type="${icon}"
                size="${size}"
                color="${_iconColor}"
              ></zen-icon>
            `
          : ''
      } <slot>Submit</slot>
    `;
  }

  private get _iconColor() {
    if (this.hollow && this.color) return this.color;
    if (this.hollow && !this.color) return 'main';
    return 'white';
  }
}


declare global {
   interface HTMLElementTagNameMap {
    // @ts-ignore
     'zen-button': ZenButton;
   }
 }
