import Element from '../../../lib/Element';
import HTML from './autocomplete.html';
import CSS from './autocomplete.scss';

import fuse from 'fuse.js';

const DEFAULT_KEY = 'value';

export default class Autocomplete extends Element {
    value: null | any  = null;
    results?: object[] | Function;
    name?: string;
    placeholder?: string;
    template?: string;
    disabled?: boolean;
    keys: string[] = [DEFAULT_KEY];

    private _input?: HTMLInputElement;
    private _resultsList?: HTMLUListElement;
    private _results: object[] = [];
    private _showResults: boolean = false;
    private _index: number | null = null;

    constructor() {
        super(HTML, CSS, 'autocomplete');
    }

    connectedCallback() {
        super.connectedCallback();
        this._input = this._root.querySelector('input') as HTMLInputElement;
        this._input.addEventListener('keyup', this._getResults.bind(this));
        this._input.addEventListener('blur', () =>
            // Timeout is so that it doesn't close immediately, and the click
            // event is fired on the item
            setTimeout(() => this._showResults = false, 100)
        );
        this._input.addEventListener('focus',
            () => this._showResults = Boolean(this._results.length)
        );
        this._input.addEventListener('keydown', this._handleKey.bind(this));
        this._input.addEventListener('change', this._handleChange.bind(this));

        this._resultsList = this._root.querySelector('ul.results') as HTMLUListElement;
    }


    static observedAttributes = ['name', 'placeholder', 'disabled'];
    static boundProps = [
        'name', 'placeholder', 'value', 'disabled', '_results', '_showResults', '_index'
    ];


    attributeChangedCallback(attr: keyof Autocomplete, oldV: string, newV: string): void {
        switch (attr) {
            case 'name':
            case 'placeholder':
                if (this[attr] !== newV) this[attr] = newV;
                break;
            case 'disabled':
                if (Boolean(this.disabled) !== Boolean(newV)) this.disabled = Boolean(newV);
        }
    }


    async propertyChangedCallback(prop: keyof Autocomplete, oldV: any, newV: any): Promise<void> {
        await this.ready();


        switch (prop) {
            case 'name':
                await this.ready();
                if (newV) {
                    if (this.getAttribute('name') !== newV) this.setAttribute('name', newV);
                }
                if (this.getAttribute('name') && !newV) this.setAttribute('name', '');
                break;

            case 'placeholder':
                await this.ready();
                if (this._input) this._input.placeholder = newV;
                break;

            case 'value':
                if (newV !== oldV) this.trigger('change', newV);
                break;

            case 'disabled':
                await this.ready();
                (this._input as HTMLInputElement).disabled = Boolean(newV);
                if (this.getAttribute('disabled') !== newV) {
                    if (Boolean(newV)) {
                        this.setAttribute('disabled', newV);
                    } else {
                        this.removeAttribute('disabled');
                    }
                }

            // @ts-ignore Valid to access this
            case '_results':
                this._renderRows();
                break;

            // @ts-ignore Valid to access this
            case '_showResults':
                await this.ready();
                (this._resultsList as HTMLUListElement).style.display = newV ? '' : 'none';
                if (newV && newV !== oldV) this._index = 0;
                else if (!newV) this._index = null;
                break;


            // @ts-ignore Valid to access this
            case '_index':
                const i = parseInt(newV, 10);
                if (i >= this._results.length) {
                    this._index = 0;
                    return;
                }
                if (i <= -1) {
                    this._index = this._results.length - 1;
                    return;
                }


                Array.from((this._resultsList as HTMLUListElement).children).forEach((e, i) => {
                    e.classList.toggle('active', parseInt(newV, 10) === i);
                });


            default:
                break;
        }
    }


    // Lookup the results based on the input
    private async _getResults(): Promise<object[] | false> {
        if (!this._input) {
            this._error('Not connected');
            return false;
        }
        const v = this._input.value;

        if (!v) return this._results = [];
        let r = [];
        if (typeof this.results === 'function') {
            r = await this.results(v);
        } else if (this.results) r = this.results;


        // If results is an array of strings, convert to default {[DEFAULT_KEY]: ...} format
        // for Fuse
        r = r.map((i: string | object) => typeof i === 'string' ? {[DEFAULT_KEY]: i} : i);


        const f = new fuse(r, {keys: this.keys});
        const s = f.search(v);


        this._results = s;


        return s;
    }


    private _renderRows() {
        const rl = this._resultsList;
        if (!rl) return this._error('Not connected');

        rl.innerHTML = '';

        (this._results || []).forEach(r => {
            const li = document.createElement('li');
            li.innerHTML = this._renderItem(r);
            li.addEventListener('click', () => this._select(r));
            rl.appendChild(li);
        });

        // Hide search results if there is only one item, and that item's value
        // is equal to autocomplete's value
        if (rl.childElementCount === 1 &&
            typeof this.value === 'object' &&
            this._renderItem(this.value) === this._renderItem(this._results[0])
        ) {
            this._showResults = false;
        } else this._showResults = Boolean(this._results.length);
    }

    private _renderItem(i: object) {
        const template = this.template || `{{${Object.keys(i)[0]}}}`;
        return this._renderTemplateString(template, i) as string;
    }


    private _handleKey(e: KeyboardEvent) {
        switch (e.key) {
            case 'Escape':
                this._showResults = false;
                break;

            case 'Enter':
                this._select();
                break;

            case 'ArrowUp':
                if (this._index != null) {
                    this._index -= 1;
                    e.stopPropagation();
                    e.preventDefault();
                }

                break;
            case 'ArrowDown':
                if (this._index != null) {
                    this._index += 1;
                    e.stopPropagation();
                    e.preventDefault();
                }
                break;

            default:
                this._handleChange();
        }
    }

    private _handleChange(e?: Event) {
        if (typeof this.value !== 'object') return;

        if ((this._input as HTMLInputElement).value !== this._renderItem(this.value)) {
            this.value = null;
        }
    }

    private _select(r?: object) {
        if (this._index == null || !this._input) return;

        this.value = r || this._results[this._index];

        this._showResults = false;

        this._input.value = this._renderItem(this.value);
    }
}

window.customElements.define('zen-ui-autocomplete', Autocomplete);
