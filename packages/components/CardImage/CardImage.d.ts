import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
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
 * @class Card Image
 * A polaroid like card with an image at the top, and some text and icons at
 * the bottom
 */
export default class CardImage extends LitElement implements CardImageProps {
    src?: string;
    heading?: string;
    icons: CardImageAction[];
    _render({heading, icons, src}: CardImageProps): TemplateResult;
}
