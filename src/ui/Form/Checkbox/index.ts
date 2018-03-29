import Element from '../../../lib/Element';
import HTML from './checkbox.html';

export default class Checkbox extends Element {
    input: HTMLInputElement;

    constructor() {
        super(HTML, false, 'Checkbox');
        this.html = HTML;

        this.input = this._root.querySelector('input') as HTMLInputElement;
        this.input.addEventListener('change', () => this.trigger('change'));
    }

    get checked() {
        return this.input.checked;
    }

    set checked(v) {
        if (this.input) this.input.checked = Boolean(v);
    }

    static get observedAttributes() {
        return ['checked'];
    }

    attributeChangedCallback(attr: keyof Checkbox, oldV: string, newV: string): void {
        switch (attr) {
            case 'checked':
                this.checked = Boolean(newV);
                break;
        }
    }
}

window.customElements.define('zen-ui-checkbox', Checkbox);
