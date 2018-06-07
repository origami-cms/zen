import {LitElement} from '@polymer/lit-element';
import {html} from 'lit-html/lib/lit-extended';
import {component, observe, property} from 'polymer3-decorators/dist';
import {InputDropdownResults} from '../InputDropdown';
import CSS from './autocomplete-css';
import {dispatchChange} from 'util/decorators';

@component('zen-autocomplete')
@dispatchChange()
export default class Autocomplete extends LitElement {

    @property
    placeholder?: string;

    @property
    name?: string;

    @property
    icon?: string;

    @property
    loading?: boolean;

    @property
    value?: string;

    @property
    query?: string;

    @property
    minlength?: number;

    @property
    private _options: InputDropdownResults = {};
    @property
    private _open: boolean = false;

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this);
    }

    private async _getResults() {
        if (!this.query) return;
        if (this.minlength && this.query.length < this.minlength) return [];

        this.loading = true;
        this._options = await fetch(encodeURI(`http://localhost:9999/api/v1/address`), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({address: this.query})
        })
            .then(r => r.json())
            // @ts-ignore This is actually an object array
            .then((r: object[]) => r.CompacAddressList.map(a => a.Address))
            .then(r => {
                this.loading = false;
                return r;
            });

        if (this._options instanceof Array && this._options.length > 0) this._open = true;
        else if (this._options) this._open = true;
        else this._open = false;
    }

    _render({icon, placeholder, loading, _options, _open, query, value}) {
        return html`
            ${CSS}
            <zen-input
                value=${query}
                on-input=${e => this.query = e.target.value}
                type="text"
                placeholder=${placeholder}
                icon=${icon}
                loading=${loading}
            ></zen-input>

            <zen-input-dropdown
                options=${_options}
                value=${value}
                on-change=${this._handleChange}
                open$=${_open}
                on-toggle=${this._handleToggle}
            ></zen-input-dropdown>

        `;
    }

    _handleChange(e) {
        this.value = this.query = e.target.value;
    }

    async _propertiesChanged(p, c, o) {
        super._propertiesChanged(p, c, o);

        if (c.query) {
            if (p.minlength && p.query.length < p.minlength) return;
            this._getResults();
        }
    }
}
