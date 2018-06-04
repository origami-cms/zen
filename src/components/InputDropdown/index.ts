import HTML from './input-dropdown.template.html';
import CSS from './input-dropdown.scss';
import {PolymerElement} from '@polymer/polymer';
import {component, property, observe, computed} from 'polymer3-decorators/dist';
import {view} from 'util/decorators';

export type InputDropdownResults = InputDropdownOptions | InputDropdownList;
export interface InputDropdownOptions { [key: string]: string; }
export type InputDropdownList = string[];

@component('zen-input-dropdown')
@view(HTML, CSS.toString())
export default class InputDropdown extends PolymerElement {
    @property
    value?: string;
    options: InputDropdownResults[] = [];

    @property({reflectToAttribute: true})
    open: boolean = false;

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

    @computed
    private _options(options: InputDropdownOptions, value: string) {

        if (options instanceof Array) return options.map(v => ({value: v, label: v}));
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

    private _toggleOpen() {
        this.open = !this.open;
    }

    @observe('value')
    private _valueChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('change'));
    }

    @observe('open')
    private _openChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('toggle'));
    }
}
