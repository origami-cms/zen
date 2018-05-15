import Element from '../../lib/Element';
import HTML from './tooltip.html';
import CSS from './tooltip.scss';

export type TooltipPosition =
    'top-left' |
    'top' |
    'top-right' |
    'right-top' |
    'right' |
    'right-bottom' |
    'bottom-right' |
    'bottom' |
    'bottom-left' |
    'top-right' |
    'left-bottom' |
    'left' |
    'left-top';

export default class Tooltip extends Element {
    position: TooltipPosition = 'bottom';
    for?: HTMLElement | null = null;

    static observedAttributes = ['position'];
    static boundProps = ['position', 'for'];

    constructor() {
        super('<slot>', CSS, 'tooltip');
    }

    connectedCallback() {
        this._update();
    }

    async attributeChangedCallback(attr: keyof Tooltip, oldV: any, newV: any) {
        switch (attr) {

            case 'position':
                await this.ready();
                if (this[attr] !== newV) this[attr] = newV;
                break;
        }
    }

    async propertyChangedCallback(prop: keyof Tooltip, oldV: any, newV: any) {
        switch (prop) {

            // Hide the tooltip if there is no for element
            case 'for':
                this.style.display = Boolean(newV) ? '' : 'none';
                this._update();
                break;

            case 'position':
                if (this.getAttribute('position') !== newV) this.setAttribute('position', newV);
                this._update();
        }
    }

    private _update() {
        // TODO: Clear up ts ignore
        if (!this.for) return;
        const {x, y, width, height} = this.for.getBoundingClientRect() as DOMRect;


        if (/^left$/.test(this.position)) {
            // @ts-ignore
            this.style.left = `${parseInt(x, 10)}px`;
        } else if (/^right$/.test(this.position)) {
            // @ts-ignore
            this.style.left = `${parseInt(x + width, 10)}px`;
        } else {
            // @ts-ignore
            this.style.left = `${parseInt(x + width / 2, 10)}px`;
        }

        if (/^top$/.test(this.position)) {
            // @ts-ignore
            this.style.top = `${parseInt(y, 10)}px`;
        } else if (/^bottom$/.test(this.position)) {
            // @ts-ignore
            this.style.top = `${parseInt(y + height, 10)}px`;
        } else {
            // @ts-ignore
            this.style.top = `${parseInt(y + height / 2, 10)}px`;
        }
    }
}

window.customElements.define('zen-ui-tooltip', Tooltip);
