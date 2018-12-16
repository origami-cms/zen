import {InputDropdown} from '@origami/zen-input-dropdown';
import {Input} from '@origami/zen-input';
import { component, dispatchChange, property } from '@origami/zen-lib/lib/decorators';
import { InputDropdownResults } from '@origami/zen-lib/lib/FormValidator';
import { LitElement, html } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import CSS from './autocomplete-css';


export interface AutocompleteProps {
    placeholder?: string;
    name?: string;
    icon?: string;
    loading?: boolean;
    value: string | null;
    query: string | null;
    minlength?: number;
    options: Function | InputDropdownResults;
    _options: InputDropdownResults;
    _open: boolean;
}

/**
 * @class Zen Autocomplete
 * @example <zen-autocomplete>
 */
@component('zen-autocomplete')
@dispatchChange()
export class Autocomplete extends LitElement implements AutocompleteProps {

    /** Default text to show when there is no entered text */
    @property
    placeholder?: string;

    /** Name of the field */
    @property
    name?: string;

    /** Icon to display in the field */
    @property
    icon?: string;

    /** Displays a loading spinner on the right */
    @property
    loading?: boolean;

    /** Value of the selected item */
    @property
    value: string | null = null;

    /** Inputted text */
    @property
    query: string | null = null;

    /** Minimum number of characters to enter before searching */
    @property
    minlength?: number;

    @property
    options: Function | InputDropdownResults = {};

    @property
    _options: InputDropdownResults = {};

    @property
    _open: boolean = false;

    _settingQuery: boolean = false;

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this);
    }

    private async _getResults(q = this.query, skipOpen = false) {
        if (!q || this.loading) return;
        if (this.minlength && q.length < this.minlength) return [];

        this.loading = true;
        if (typeof this.options === 'function') {
            this._options = await this.options(q);
        } else this._options = this.options;
        this.loading = false;

        if (skipOpen) this._open = false;
        else if (this._options instanceof Array && this._options.length > 0) this._open = true;
        else if (this._options) this._open = true;
        else this._open = false;
    }

    render(): TemplateResult {
        const { icon, placeholder, loading, _options, _open, query, value } = this;

        return html`
            ${CSS}
            <zen-input
                .value=${query}
                @input=${(e: {target: Input}) => this.query = e.target.value!}
                type="text"
                .placeholder=${placeholder}
                .icon=${icon}
                .loading=${loading}
            ></zen-input>

            <zen-input-dropdown
                .options=${_options}
                .value=${value}
                @change=${this._handleChange}
                .open=${_open}
            ></zen-input-dropdown>

        `;
    }

    _handleChange(e: {target: InputDropdown}) {
        if (e.target.value === this.value) return;
        this.value = e.target.value || null;
        this._open = false;
        this._updateQuery();
    }

    private _updateQuery() {
        if (!this.value) this.query = '';
        else {
            this._settingQuery = true;
            if (this._options instanceof Array) {

                if (this._options.includes(this.value)) this.query = this.value;
                else {
                    // @ts-ignore
                    const opt = this._options.find(o => o.value === this.value);
                    // @ts-ignore
                    if (opt) this.query = opt.label;
                }
            } else if (this._options instanceof Object) {
                // @ts-ignore
                this.query = this._options[this.value];
            }
        }
    }


    async firstUpdated(p: any) {
        super.firstUpdated(p);
        this._open = false;
    }

    async updated(p: any) {
        super.updated(p);

        const query = p.get('query');


        // If the query was set internally, skip getting results
        if (this._settingQuery) this._settingQuery = false;

        // Otherwise if the query was changed and it's not loading...
        else if (
            this.query &&
            !this.loading &&
            !p.has('loading') &&
            p.has('query') && query !== this.query
        ) {
            if (!this.minlength || this.query.length >= this.minlength) {
                const firstRender = p.has('query') && query === undefined;
                this._getResults(this.query, firstRender);
            }
        }


        // If the query is below minimum or doesn't exist, close dropdown
        if (
            !this.query ||
            (this.minlength && this.query && this.query.length < this.minlength) &&
            this._open
        ) {
            this._open = false;
        }

        // Update the dropdown's open attribute to match _open
        const dd = this.shadowRoot!.querySelector('zen-input-dropdown') as InputDropdown;
        if (!this._open) dd.removeAttribute('open');
        else dd.setAttribute('open', 'true');
    }
}
