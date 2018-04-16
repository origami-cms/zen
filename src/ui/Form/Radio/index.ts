import Element from '../../../lib/Element';
import HTML from './radio.html';
import CSS from './radio.scss';
import {Icon} from '../..';


export default class Radio extends Element {
    options: {[key: string]: string} = {};
    name?: string;

    constructor() {
        super(HTML, CSS, 'Radio');
    }

    static observerAttributes = ['name'];
    static boundProps = ['options', 'name'];


    get value() {
        const checked = this._root.querySelector('.option.checked');
        return checked ? checked.getAttribute('data-value') as string : null;
    }

    set value(v) {
        const opts = this._options;

        opts.forEach(o => {
            const c = (o.getAttribute('data-value') === v);
            o.classList.toggle('checked', c);
            const i = o.querySelector('zen-ui-icon') as Icon;
            i.type = c ? 'radio-checked' : 'radio-unchecked';
            i.color = c ? 'main' : 'grey-300';
        });
    }

    private get _options() {
        return Array.from(this._root.querySelectorAll('.option'));
    }

    attributeChangedCallback(attr: keyof Radio, oldV: string, newV: string): void {
        switch (attr) {
            case 'name':
                if (this.name !== newV) this.name = newV;
        }
    }

    async propertyChangedCallback(prop: keyof Radio, oldV: string, newV: string): Promise<void> {
        switch (prop) {
            case 'value':
                if (newV !== oldV) {
                    this.trigger('change');
                }
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

    private async _updateOptions() {
        await this.ready();

        super.render();
        const o = this._root.querySelector('.options') as HTMLElement;

        o.innerHTML = '';

        if (this.options) {
            Object.entries(this.options).forEach(([value, label]) => {
                const doc = this._renderTemplate('option', {label, value});
                const opt = doc.querySelector('.option') as HTMLElement;
                opt.setAttribute('data-label', label);
                opt.setAttribute('data-value', value);
                const icon = doc.querySelector('zen-ui-icon') as Icon;
                icon.type = 'radio-unchecked';
                icon.color = 'grey-300';

                opt.addEventListener('click', () => this.value = value);
                o.appendChild(opt);
            });
        }
    }
}

window.customElements.define('zen-ui-radio-select', Radio);
