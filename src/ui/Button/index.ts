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
    private _icon: Icon;

    constructor() {
        super(HTML, CSS.toString(), 'Button');
        this._icon = this._root.querySelector('zen-ui-icon') as HTMLElement as Icon;
    }

    static get boundProps() {
        return ['type', 'color', 'size', 'icon', 'hollow', 'icon-position'];
    }

    static get observedAttributes() {
        return ['type', 'color', 'size', 'hollow', 'icon-position'];
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
        }
    }

    connectedCallback() {
        super.connectedCallback();

        this.icon = this.getAttribute('icon') || false;
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


            case 'color':
                // this.button.classList.toggle(oldV, false);
                // this.button.classList.toggle(newV, true);
                break;

            case 'size':
                // this.button.classList.toggle(`size-${oldV}`, false);
                // this.button.classList.toggle(`size-${newV}`, true);
                if (this._icon) this._icon.size = newV;
                break;

            case 'hollow':
                // this.button.classList.toggle('hollow', Boolean(newV));
        }
    }
}


window.customElements.define('zen-ui-button', Button);
