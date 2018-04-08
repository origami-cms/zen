import Element from '../../../lib/Element';
import HTML from './radio-icons.html';
import CSS from './radio-icons.scss';
import {FieldRadioIconsOption} from '../FieldTypes';
import {Icon} from '../..';

export default class RadioIcons extends Element {
    options: FieldRadioIconsOption[] = [];
    value: FieldRadioIconsOption['value'] | null = null;
    name: string | undefined = undefined;


    constructor() {
        super(HTML, CSS, 'radio-icons');
    }

    static boundProps = ['options', 'value', 'name'];
    static observedAttributes = ['name'];

    private get _grid(): HTMLDivElement | null {
        return this._root.querySelector('ul.options');
    }


    private _replace() {
        super.render();
        const g = this._grid;
        if (!g || !this.options) return;

        g.innerHTML = '';

        this.options.forEach(o => {
            const values = {...o};
            if (!values.label) values.label = values.value;
            const t = this._renderTemplate('option', values);

            const imgContainer = (t.querySelector('.img') as HTMLElement);
            const img = (t.querySelector('.img img') as HTMLImageElement);
            const icon = (t.querySelector('.img zen-ui-icon') as Icon);

            // Add the src or type for image, icon, or html string
            if (o.image) {
                img.src = o.image;
                icon.remove();
            } else if (o.icon) {
                icon.type = o.icon;
                img.remove();
            } else if (o.html) {
                img.remove();
                icon.remove();
                imgContainer.innerHTML = o.html;
            }

            const li = t.querySelector('li') as HTMLLIElement;
            li.setAttribute('data-value', o.value.toString());
            li.addEventListener('click', () => this.value = o.value);
            g.appendChild(t);
        });
    }


    attributeChangedCallback(attr: keyof RadioIcons, oldV: string, newV: string): void {
        switch (attr) {
            case 'name':
                if (this.name !== newV) this.name = newV;
        }
    }


    propertyChangedCallback(prop: keyof RadioIcons, oldV: string, newV: string) {
        switch (prop) {
            case 'options':
                if (newV !== oldV) this._replace();
                break;

            case 'value':

                // Remove all active classes from current options
                Array.from(this._root.querySelectorAll('li'))
                    .forEach(li => li.classList.remove('active'));
                // Add active class to current option
                if (newV) {
                    const option = this._root.querySelector(`li[data-value="${newV.toString()}"]`);
                    if (option) option.classList.add('active');
                }

                if (newV !== oldV) this.trigger('change', {value: newV});
        }
    }
}

window.customElements.define('zen-ui-radio-icons', RadioIcons);
