import Element from '../../../lib/Element';
import HTML from './select.html';
import CSS from './select.scss';


export default class Select extends Element {
    options: {[key: string]: string} = {};
    placeholder?: string;
    name?: string;

    constructor() {
        super(HTML, CSS, 'Select');
    }

    static observeredAttributes = ['name'];
    static boundProps = ['options', 'name', 'value'];


    get value() {
        return this._select ? this._select.value : null;
    }


    private get _select(): HTMLSelectElement | null {
        return this._root.querySelector('select');
    }

    connectedCallback() {
        const s = this._select as HTMLSelectElement;
        // s.addEventListener('change', () => this.value = s.value);
    }

    attributeChangedCallback(attr: keyof Select, oldV: string, newV: string): void {
        switch (attr) {
            case 'name':
                if (this.name !== newV) this.name = newV;
        }
    }

    async propertyChangedCallback(prop: keyof Select, oldV: string, newV: string): Promise<void> {
        switch (prop) {
            case 'value':
                await this.ready();
                console.log('value is', newV);
                if (newV !== oldV) this.trigger('change');
                if (this._select) this._select.value = newV || '';

                break;
            case 'options':
                await this.ready();
                this._updateOptions();
                break;
            case 'name':
                await this.ready();
                if (newV) {
                    if (this.getAttribute('name') !== newV) this.setAttribute('name', newV);
                }
                if (this.getAttribute('name') && !newV) this.setAttribute('name', '');
                break;
        }
    }

    private _updateOptions() {
        super.render();
        const s = this._select;
        if (!s) return;

        s.innerHTML = '';
        if (this.placeholder) {
            const placeholder = document.createElement('option');
            placeholder.selected = true;
            placeholder.disabled = true;
            placeholder.value = '';
            placeholder.innerHTML = this.placeholder;
            s.appendChild(placeholder);
        }

        if (this.options) {
            Object.entries(this.options).forEach(([o, v]) => {
                const opt = document.createElement('option');
                opt.value = o;
                opt.innerHTML = v;
                s.appendChild(opt);
            });
        }
    }
}

window.customElements.define('zen-ui-select', Select);
