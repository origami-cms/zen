import Element from '../../lib/Element';
import HTML from './icon.html';
import CSS from './icon.scss';

export default class Icon extends Element {
    size: string = 'main';
    type: string = '';
    color: string = 'main';
    readonly html: string = HTML;

    private _prefix = '#zen-icon-';

    constructor() {
        super(HTML, CSS.toString(), 'Icon');
    }

    get svg(): SVGElement {
        return this._root.querySelector('svg') as SVGElement;
    }
    get use(): SVGUseElement {
        return this.svg.querySelector('use') as SVGUseElement;
    }

    static get defaultProps() {
        return {
            color: 'main',
            size: 'main'
        };
    }
    static get boundProps() {
        return ['type', 'color', 'size'];
    }

    static get observedAttributes() {
        return ['type', 'color', 'size'];
    }

    attributeChangedCallback(attr: keyof Icon, oldV: string, newV: string): void {
        switch (attr) {
            case 'type':
            case 'color':
            case 'size':
                this[attr] = newV;
                break;
        }
    }

    async propertyChangedCallback(prop: string, oldV: string, newV: string): Promise<void> {
        switch (prop) {
            case 'type':
                if (!newV) return;
                // Remove all old symbols and replace with new one
                Array.from(this.svg.querySelectorAll('symbol')).forEach(s => s.remove());

                // Clone the new symbol from the icon set
                const existing = document.querySelector(this._prefix + newV);
                if (!existing) return this._error(`No icons found for '${newV}'`);

                const symbol = existing.cloneNode(true);
                this.svg.appendChild(symbol);
                // Update the ref on the use
                this.use.setAttribute('xlink:href', this._prefix + newV);
                break;

            case 'color':
                if (this.svg) {
                    this.svg.classList.toggle(oldV, false);
                    this.svg.classList.toggle(newV, true);
                }
                break;
        }
    }

    render() {
        super.render();
        const {svg} = this;
        if (svg) {
            svg.classList.toggle(this.color, true);
        }
    }
}

window.customElements.define('zen-ui-icon', Icon);
