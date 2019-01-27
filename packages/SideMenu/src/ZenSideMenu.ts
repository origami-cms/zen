import { customElement, html, LitElement, property } from 'lit-element';
import CSS from './side-menu-css';

export interface SideMenuLink {
  icon?: string;
  text?: string;
  href?: string;
}

export interface SettingsMenuProps {
  links: SideMenuLink[];
}

// @ts-ignore
@customElement('zen-side-menu')
export class ZenSideMenu extends LitElement implements SettingsMenuProps {
  @property()
  public links: SideMenuLink[] = [];

  public render() {
    return html`
      ${CSS}
      <ul>
        ${
          this.links.map(
            (l) => html`
              <li>
                <zen-link .href="${l.href}">
                  ${l.icon
                      ? html`<zen-icon
                        type="${l.icon}"
                        color="grey-300"
                        size="medium"
                      ></zen-icon>`
                      : ''
                  } <span>${l.text}</span>
                </zen-link>
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
    'zen-side-menu': ZenSideMenu;
  }
}
