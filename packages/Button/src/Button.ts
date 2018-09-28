import Icon from '@origamijs/zen-icon';
import { bindAttributes, component } from '@origamijs/zen-lib/lib/decorators';
import { html, LitElement } from '@polymer/lit-element';
import { property } from 'polymer3-decorators';
import CSS from './button-css';
import { TemplateResult } from 'lit-html';

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
 * @class Button
 * The button element is a styled button with options of
 * adding an icon, loading state, and size.
 */
@component('zen-button')
@bindAttributes
export default class Button extends LitElement implements ButtonProps {

    @property
    size?: string;

    @property
    icon?: string | boolean;

    @property
    iconright?: boolean;

    @property
    hollow?: boolean;

    @property
    color?: string;

    @property
    disabled?: boolean;

    @property
    loading?: boolean;

    private static _boundAttributes = ['hollow', 'color', 'iconright', 'icon', 'disabled', 'size', 'loading'];


    render(): TemplateResult {
        const { icon, size, loading, _iconColor} = this;

        return html`
            ${CSS}
            ${loading ? html`<zen-loading></zen-loading>` : '' }
            ${(icon && !loading)
                ? html`<zen-icon .type="${icon}" .size="${size}" .color="${_iconColor}"></zen-icon>`
                : ''
            }
            <slot>Submit</slot>
        `;
    }

    private get _iconColor() {
        if (this.hollow && this.color) return this.color;
        if (this.hollow && !this.color) return 'main';
        return 'white';
    }
}
