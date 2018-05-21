import Element from '../../../lib/Element';
import HTML from './checkbox.html';
import CSS from './checkbox.scss';

export default class Checkbox extends Element {
    input: HTMLInputElement | null = null;
    name: string | undefined = undefined;
    size?: string;

    static boundProps = ['name', 'size'];

    static observedAttributes = ['checked', 'name', 'size'];

    constructor() {
        super(HTML, CSS);
        this._handleChange = this._handleChange.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.input = this._root.querySelector('input') as HTMLInputElement;
        this.input.addEventListener('change', this._handleChange);
    }

    disconnectedCallback() {
        (this.input as HTMLInputElement).addEventListener('change', this._handleChange);
    }

    get checked(): boolean | null {
        if (!this.input) return null;
        return this.input.checked;
    }

    set checked(v) {
        if (this.input) this.input.checked = Boolean(v);
    }

    async attributeChangedCallback(attr: keyof Checkbox, oldV: string, newV: string) {
        switch (attr) {
            case 'checked':
                this.checked = Boolean(newV);
                break;

            case 'name':
            case 'size':
                await this.ready();
                if (this[attr] !== newV) this[attr] = newV;
        }
    }

    async propertyChangedCallback(prop: keyof Checkbox, oldV: string, newV: string): Promise<void> {
        switch (prop) {
            case 'name':
                await this.ready();
                if (newV) {
                    if (this.getAttribute('name') !== newV) this.setAttribute('name', newV);
                }
                if (this.getAttribute('name') && !newV) this.setAttribute('name', '');
                break;

            case 'size':
                await this.ready();
                if (newV) {
                    if (this.getAttribute('size') !== newV) this.setAttribute('size', newV);
                }
                else if (this.getAttribute('size')) this.setAttribute('size', '');

            default:
                break;
        }
    }

    private _handleChange(e: Event) {
        e.stopPropagation();
        this.trigger('change');
    }
}

window.customElements.define('zen-ui-checkbox', Checkbox);
