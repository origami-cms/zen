import { bindAttributes } from '@origami/zen-lib/decorators';
import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';
import CSS from './card-image-css';

export interface CardImageAction {
  icon: string;
  color?: string;
  action?: Function;
}

export interface CardImageProps {
  src?: string;
  heading?: string;
  icons: CardImageAction[];
}

/**
 * A polaroid like card with an image at the top, and some text and icons at
 * the bottom
 */
@customElement('zen-card-image')
@bindAttributes
export class ZenCardImage extends LitElement implements CardImageProps {
  @property() public src?: string;
  @property() public heading?: string;
  @property() public icons: CardImageAction[] = [];

  public render() {
    const { heading, icons, src } = this;
    return html`
      ${CSS}
      ${
        src
          ? html`
              <div class="img-wrapper"><img .src="${src}" /></div>
            `
          : null
      }
      <div class="details">
        <div class="text">
          ${
            heading
              ? html`
                  <strong>${heading}</strong>
                `
              : null
          } <slot></slot>
        </div>
        <div class="icons">
          ${
            icons.map(
              (i) =>
                html`
                  <zen-icon .type=${i.icon}.color=${i.color}
                  @click=${i.action}/>
                `
            )
          }
        </div>
      </div>
    `;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-card-image': ZenCardImage;
  }
}
