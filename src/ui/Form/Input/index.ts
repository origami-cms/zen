import Element from '../../../lib/Element';
import CSS from './input.scss';

export default class Input extends Element {
    placeholder?: string;
    name?: string;
    type: string = 'text';

    static observedAttributes = ['placeholder', 'name', 'type'];
    static boundProps = ['placeholder', 'name', 'type'];

    private _value: string | number | null = null;


    constructor() {
        super('<input />', CSS);
        this._handleKeyUp = this._handleKeyUp.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    get value() {
        switch (this.type) {
            case 'number':
                return Number(this._value);
            default:
                return this._value;
        }
    }
    set value(v) {
        if (v) this._input.value = v.toString();
        this._value = v;
    }

    get _input() {
        return this._root.querySelector('input') as HTMLInputElement;
    }


    connectedCallback() {
        super.connectedCallback();
        this._input.addEventListener('keyup', this._handleKeyUp);
        this._input.addEventListener('change', this._handleChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._input.removeEventListener('keyup', this._handleKeyUp);
        this._input.removeEventListener('change', this._handleChange);
    }


    attributeChangedCallback(attr: keyof Input, oldV: any, newV: any) {
        switch (attr) {
            case 'placeholder':
            case 'name':
            case 'type':
                this[attr] = newV;
                break;
        }
    }

    async propertyChangedCallback(prop: keyof Input, oldV: any, newV: any) {
        switch (prop) {
            case 'placeholder':
            case 'name':
            case 'type':
                await this.ready();
                this._input.setAttribute(prop, newV);
                break;
        }
    }

    private _handleKeyUp(e: Event) {
        this.value = this._input.value;
        this.trigger('keyup', e);
    }
    private _handleChange(e: Event) {
        this.value = this._input.value;
        this.trigger('change', e);
    }
}

window.customElements.define('zen-ui-input', Input);
