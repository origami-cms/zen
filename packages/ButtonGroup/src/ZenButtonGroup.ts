import { ButtonProps } from '@origami/zen-button';
import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import CSS from './button-group-css';

export interface ButtonOptions extends ButtonProps {
  text?: string;
  onclick?: Function;
}

export interface ButtonGroupProps {
  buttons: ButtonOptions[];
}

@customElement('zen-button-group')
export class ZenButtonGroup extends LitElement implements ButtonGroupProps {
  @property()
  public buttons: ButtonOptions[] = [];

  @property()
  public size: string = 'main';

  public render() {
    return html`
      ${CSS}
      ${
        repeat(
          this.buttons,
          () => {},
          (b) => html`
            <zen-button
              .size="${b.size || this.size}"
              .icon="${b.icon}"
              .iconright="${b.iconright}"
              .hollow="${b.hollow}"
              .color="${b.color}"
              .disabled="${b.disabled}"
              .loading="${b.loading}"
              @click="${b.onclick}"
              >${b.text}</zen-button
            >
          `
        )
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-button-group': ZenButtonGroup;
  }
}
