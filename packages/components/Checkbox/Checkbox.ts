import { html, LitElement } from '@polymer/lit-element';
import { component, dispatchChange, property } from '../../util/decorators';
import CSS from './checkbox-css';
import { TemplateResult } from 'lit-html';


export interface props {
    name?: string;
    size?: string;
    checked?: boolean;
}
@component('zen-checkbox')
@dispatchChange('checked')
export default class Checkbox extends LitElement implements props {

    @property
    name?: string;

    @property
    size?: string;

    @property
    checked?: boolean;

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this)
    }

    _render({checked}: props): TemplateResult {
        return html`
            ${CSS}
            <label class="checkbox">
                <input type="checkbox" checked="${checked}" on-change=${this._handleChange}/>
                <span class="check"></span>
            </label>
        `;
    }

    private _handleChange(e: Event) {
        this.checked = (e.target as HTMLInputElement).checked;
    }
}
