import {LitElement} from '@polymer/lit-element';
import {html} from 'lit-html/lib/lit-extended';
import {component, observe, property} from 'polymer3-decorators/dist';
import {dispatchChange, bindAttributes} from 'util/decorators';

export type InputDropdownResults = InputDropdownOptions | InputDropdownList;
export interface InputDropdownOptions { [key: string]: string; }
export type InputDropdownList = string[];

import CSS from './input-dropdown-css';

@component('zen-input-dropdown')
@dispatchChange()
@dispatchChange('open', 'toggle')
@bindAttributes
export default class InputDropdown extends LitElement {
    @property
    value?: string;

    @property
    options: InputDropdownResults[] = [];

    @property
    open: boolean = false;

    private static _boundAttributes = ['open'];

    constructor() {
        super();
        this._handleEscape = this._handleEscape.bind(this);
        this._handleClick = this._handleClick.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this._handleEscape);
        document.addEventListener('mouseup', this._handleClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this._handleEscape);
        document.removeEventListener('mouseup', this._handleClick);
    }

    _render({options, value, open}) {
        const opt = this._options(options, value);
        return html`
            ${CSS}
            ${opt.map(o => html`
                <div class="option" on-click=${() => this.value = o.value}>
                    ${o.label}
                </div>
            `)}
        `;
    }

    private _options(options: InputDropdownOptions, value: string) {

        if (options instanceof Array) {
            return options.map(v => {
                if (typeof v === 'string') return {value: v, label: v};
                return v;
            });
        }
        return Object.entries(options).map(([v, label]) => ({
            label,
            value: v
        }));
    }

    private _handleEscape(e: KeyboardEvent) {
        if (e.key === 'Escape') this.open = false;
    }

    private _handleClick(e: Event) {
        // @ts-ignore Added by dom-repeat
        if (e.model) this.value = e.model.item.value;
        this.open = false;
    }

    async _propertiesChanged(p, c, o) {
        super._propertiesChanged(p, c, o);
        if (c.open !== undefined) {
            console.log('OK', p.open);

        }
    }
}
