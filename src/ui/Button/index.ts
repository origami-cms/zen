import '../../imports';

import Element from '../../lib/Element';
import HTML from './button.html';
import CSS from './button.scss';

import Icon from '../Icon';


export default class Button extends Element {
    size: string = 'main';
    icon: string | false = false;
    'icon-position': boolean = false;
    hollow: boolean = false;
    color: string = 'main';
    disabled?: boolean;
    loading: boolean = false;
    private _icon: Icon;
    private _contents?: HTMLSpanElement;
    private _loader?: HTMLSpanElement;

    constructor() {
        super(HTML, CSS.toString(), 'Button');
        this._icon = this._root.querySelector('zen-ui-icon') as HTMLElement as Icon;
    }

    static get boundProps() {
        return ['type', 'color', 'size', 'icon', 'hollow', 'icon-position', 'disabled', 'loading'];
    }

    static get observedAttributes() {
        return ['type', 'color', 'size', 'hollow', 'icon-position', 'disabled'];
    }

    attributeChangedCallback(attr: keyof Button, oldV: string, newV: string): void {
        switch (attr) {
            case 'icon':
            case 'color':
            case 'size':
            case 'hollow':
            case 'icon-position':
                this[attr] = newV;
                break;

            case 'disabled':
                if (Boolean(this.disabled) !== Boolean(newV)) this.disabled = Boolean(newV);
                break;
        }
    }

    connectedCallback() {
        super.connectedCallback();

        this.icon = this.getAttribute('icon') || false;
        this._contents = this._root.querySelector('span.content') as HTMLSpanElement;
        this._loader = this._root.querySelector('span.loading') as HTMLSpanElement;
    }

    async propertyChangedCallback(prop: keyof Button, oldV: string, newV: string): Promise<void> {
        await this.ready();
        switch (prop) {
            case 'icon':
                this._icon.style.display = Boolean(newV) ? '' : 'none';

                if (newV) {
                    this._icon.type = newV;
                    this._icon.size = this.size;
                }
                break;

            case 'icon-position':
                if (!this.icon) return;
                if (newV === 'right') {
                    this._root.appendChild(this._icon);
                    this.classList.add('icon-right');
                } else {
                    this._root.insertBefore(this._icon, this._root.firstChild);
                    this.classList.remove('icon-right');
                }


            case 'size':
                if (this._icon) this._icon.size = newV;
                break;

            case 'hollow':
                if (newV && this.icon) this._icon.color = this.color;
                break;

            case 'disabled':
                await this.ready();

                if (newV) this.setAttribute('disabled', 'true');
                else if (this.getAttribute('disabled')) {
                    this.removeAttribute('disabled');
                }
                break;

            case 'loading':
                if (this._contents && this._loader) {
                    this._icon.style.opacity = newV ? '0' : '1';
                    this._contents.style.opacity = newV ? '0' : '1';
                    this._loader.style.opacity = newV ? '1' : '0';
                }

                if (Boolean(newV) !== Boolean(oldV)) {
                    this.disabled = Boolean(newV);
                }
        }
    }
}


window.customElements.define('zen-ui-button', Button);
