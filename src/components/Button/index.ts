import {html, LitElement} from '@polymer/lit-element';
import {component, observe, property} from 'polymer3-decorators';
import {bindAttributes} from 'util/decorators';
import Icon from '../Icon';
import CSS from './button-css';

interface props {
    size?: string;
    icon?: string | false;
    'iconright': boolean;
    hollow?: boolean;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
}

@component('zen-button')
@bindAttributes
export default class Button extends LitElement implements props {
    @property
    size?: string;
    @property
    icon?: string | false;
    @property
    'iconright': boolean;
    @property
    hollow?: boolean;
    @property
    color?: string;
    @property
    disabled?: boolean;
    @property
    loading?: boolean;

    private static _boundAttributes = ['hollow', 'color', 'iconright', 'icon', 'disabled'];

    private get _icon() {
        return this.shadowRoot.querySelector('zen-icon') as Icon;
    }


    _render({icon, size, hollow}: props) {
        return html`
            ${CSS}
            ${icon
                ? html`<zen-icon type="${icon}" size="${size}" color="${this._iconColor}"></zen-icon>`
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

    @observe('icon')
    private _iconChanged(newV: string) {
        if (!newV && this.iconright) this.iconright = false;
    }
}
