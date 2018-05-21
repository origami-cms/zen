import Element from '../../../lib/Element';
import HTML from './radio-tabs.html';
import CSS from './radio-tabs.scss';


export default class RadioTabs extends Element {
    options: { [key: string]: string } = {};
    name?: string;

    constructor() {
        super(HTML, CSS);
    }

    static observedAttributes = ['name'];
    static boundProps = ['options', 'name', 'value'];


    get value() {
        const checked = this._root.querySelector('.option.active');
        return checked ? checked.getAttribute('data-value') as string : null;
    }

    set value(v) { }

    private get _options() {
        return Array.from(this._root.querySelectorAll('.tab'));
    }

    attributeChangedCallback(attr: keyof RadioTabs, oldV: string, newV: string): void {
        switch (attr) {
            case 'name':
                if (this.name !== newV) this.name = newV;
        }
    }

    async propertyChangedCallback(
        prop: keyof RadioTabs,
        oldV: string,
        newV: string
    ): Promise<void> {
        switch (prop) {
            case 'value':
                await this.ready();

                if (newV !== oldV) {
                    const opts = this._options;

                    opts.forEach(o => {
                        // tslint:disable-next-line
                        const c = (o.getAttribute('data-value') == newV);
                        o.classList.toggle('active', c);
                    });
                    this.trigger('change');
                }
                break;

            case 'options':
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
        this.html = '';

        if (this.options) {
            Object.entries(this.options).forEach(([value, label]) => {
                const doc = this._renderTemplate('tab', {label, value});
                const opt = doc.querySelector('.tab') as HTMLElement;
                opt.setAttribute('data-label', label);
                opt.setAttribute('data-value', value);
                opt.addEventListener('click', () => this.value = value);
                this._root.appendChild(opt);
            });
        }
    }
}

window.customElements.define('zen-ui-radio-tabs', RadioTabs);
