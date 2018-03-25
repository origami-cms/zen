import '../../imports';

import Element from '../../lib/Element';
import HTML from './button.html';
import CSS from './button.scss';

import Icon from '../Icon';


window.customElements.define('zen-ui-button', class Button extends Element {
    button: HTMLButtonElement;
    size: string = 'main';
    icon: string | false = false;
    hollow: boolean = false;
    color: string = 'main';
    private _icon: Icon;

    constructor() {
        super(HTML, CSS.toString());
        this.button = this._sr.querySelector('button') as HTMLButtonElement;
        this._icon = this._sr.querySelector('zen-ui-icon') as HTMLElement as Icon;
    }

    static get boundProps() {
        return ['type', 'color', 'size', 'icon', 'hollow'];
    }

    static get observedAttributes() {
        return ['type', 'color', 'size', 'hollow'];
    }

    attributeChangedCallback(attr: keyof Button, oldV: string, newV: string): void {
        switch (attr) {
            case 'icon':
            case 'color':
            case 'size':
            case 'hollow':
                this[attr] = newV;
                break;
        }
    }

    async propertyChangedCallback(prop: string, oldV: string, newV: string): Promise<void> {
        await this.ready();
        switch (prop) {
            case 'icon':
                this._icon.classList.toggle('hide', !newV);

                if (newV) {
                    this._icon.type = newV;
                    this._icon.size = this.size;
                }
                break;

            case 'color':
                this.button.classList.toggle(oldV, false);
                this.button.classList.toggle(newV, true);
                break;

            case 'size':
                this.button.classList.toggle(`size-${oldV}`, false);
                this.button.classList.toggle(`size-${newV}`, true);
                if (this._icon) this._icon.size = newV;
                break;

            case 'hollow':
                this.button.classList.toggle('hollow', Boolean(newV));
        }
    }
});
