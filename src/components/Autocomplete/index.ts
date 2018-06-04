import HTML from './autocomplete.template.html';
import CSS from './autocomplete.scss';
import {PolymerElement} from '@polymer/polymer';
import {component, property, observe} from 'polymer3-decorators/dist';
import {view} from 'util/decorators';
import {InputDropdownResults} from '../InputDropdown';

@component('zen-autocomplete')
@view(HTML, CSS.toString())
export default class Autocomplete extends PolymerElement {

    @property({reflectToAttribute: true})
    placeholder?: string;

    @property({reflectToAttribute: true})
    name?: string;

    @property({reflectToAttribute: true})
    type: string = 'text';

    @property({reflectToAttribute: true})
    icon?: string;

    @property({reflectToAttribute: true})
    loading?: boolean;

    @property
    value?: string;

    query?: string;

    minlength?: number;

    private _options: InputDropdownResults = {};
    private _open: boolean = false;

    @observe('value')
    private _valueChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('change'));
    }

    @observe('query')
    private async _queryChanged(newV: string) {
        if (this.minlength && newV.length < this.minlength) return;
        this._options = await this._results;
        if (this._options instanceof Array && this._options.length > 0) this._open = true;
        else if (this._options) this._open = true;
        else this._open = false;
    }

    private get _results() {
        this.loading = true;
        return fetch(encodeURI(`http://localhost:9999/api/v1/address`), {
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
    }
}
