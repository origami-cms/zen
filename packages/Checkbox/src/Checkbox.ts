import { html, LitElement } from '@polymer/lit-element';
import { component, dispatchChange, property } from '@origamijs/zen-lib/lib/decorators';
import CSS from './checkbox-css';
import { TemplateResult } from 'lit-html';


export interface CheckboxProps {
    name?: string;
    size?: string;
    checked?: boolean;
}
@component('zen-checkbox')
@dispatchChange('checked')
export class Checkbox extends LitElement implements CheckboxProps {

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

    render(): TemplateResult {
        return html`
            ${CSS}
            <label class="checkbox">
                <input type="checkbox" ?checked="${this.checked}" @change=${this._handleChange}/>
                <span class="check"></span>
            </label>
        `;
    }

    private _handleChange(e: Event) {
        this.checked = (e.target as HTMLInputElement).checked;
    }
}
