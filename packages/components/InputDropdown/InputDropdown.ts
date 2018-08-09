import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { InputDropdownResults } from '../../lib/FormValidator/FormFieldTypes';
import { bindAttributes, component, dispatchChange, property } from '../../util/decorators';
import CSS from './input-dropdown-css';


export interface props {
    value?: string;
    options: InputDropdownResults;
    open: boolean;
    _active?: number;
}

@component('zen-input-dropdown')
@dispatchChange()
@dispatchChange('open', 'toggle')
@bindAttributes
export default class InputDropdown extends LitElement implements props {
    @property
    value?: string;

    @property
    options: InputDropdownResults = [];

    @property
    open: boolean = false;

    @property
    _active?: number;

    // private static _boundAttributes = ['open'];

    constructor() {
        super();
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._handleClick = this._handleClick.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this._handleKeyDown);
        document.addEventListener('mouseup', this._handleClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this._handleKeyDown);
        document.removeEventListener('mouseup', this._handleClick);
    }

    _render({options, value, open, _active}: props): TemplateResult {
        let opt;
        if (options) opt = this._options(options);


        if (!opt) return html``;

        return html`
            ${CSS}
            ${opt.map((o, i) => html`
                <div
                    class$="option ${_active === i ? 'active' : ''}"
                    on-click=${() => this.value = o.value}
                    on-mouseenter=${() => this._active = i}
                > ${o.label} </div>
            `)}
        `;
    }

    _didRender() {
        if (!this.open) this.removeAttribute('open');
        else this.setAttribute('open', 'true');
    }

    private _options(options: InputDropdownResults) {
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

    private _handleKeyDown(e: KeyboardEvent) {
        let opt: {value: string, label: string | number}[] = [];
        if (this.options) opt = this._options(this.options);

        if (!this._active) this._active = 0;

        switch (e.key) {
            case 'Escape':
                this.open = false;
                break;

            case 'ArrowDown':
                e.preventDefault();
                e.stopPropagation();
                this._active += 1;
                break;

            case 'ArrowUp':
                e.preventDefault();
                e.stopPropagation();
                this._active -= 1;
                break;

            case 'Enter':
                if (this.open) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.value = opt[this._active].value;
                }

                break;

            default:
                break;
        }

        if (this._active === opt.length || !this._active) this._active = 0;
        if (this._active < 0) this._active = opt.length - 1;
    }

    private _handleClick(e: Event) {
        // @ts-ignore Added by dom-repeat
        if (e.model) this.value = e.model.item.value;
        this.open = false;
    }
}
