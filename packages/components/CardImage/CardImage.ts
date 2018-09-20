import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { property } from 'polymer3-decorators';
import { bindAttributes, component } from '../../util/decorators';
import CSS from './card-image-css';


export interface CardImageAction {
    icon: string;
    color?: string;
    action?: Function;
};

export interface CardImageProps {
    src?: string;
    heading?: string;
    icons: CardImageAction[]
}
console.log('heres');


/**
 * @class Card Image
 * A polaroid like card with an image at the top, and some text and icons at
 * the bottom
 */
@component('zen-card-image')
@bindAttributes
export default class CardImage extends LitElement implements CardImageProps {
    @property src?: string;
    @property heading?: string;
    @property icons: CardImageAction[] = [];


    _render({heading, icons, src}: CardImageProps): TemplateResult {
        return html`
            ${CSS}
            ${src ? html`<div class="img-wrapper"><img src=${src} /></div>` : null}
            <div class="details">
                <div class="text">
                    ${heading ? html`<strong>${heading}</strong>` : null}
                    <slot></slot>
                </div>
                <div class="icons">
                    ${icons.map(i => html`<zen-icon type=${i.icon} color=${i.color} on-click=${i.action}/>`)}
                </div>
            </div>
        `;
    }
}
