import { dispatchChange } from '@origami/zen-lib/lib/decorators';
import { customElement, html, LitElement, property } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import CSS from './checkbox-css';


export interface CheckboxProps {
    name?: string;
    size?: string;
    checked: boolean;
}

// @ts-ignore
@customElement('zen-checkbox')
@dispatchChange('checked')
export class Checkbox extends LitElement implements CheckboxProps {

    @property()
    name?: string;

    @property()
    size?: string;

    @property()
    checked: boolean = false;

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this);
    }

    render(): TemplateResult {
        const checked = this.checked ? 'checked' : '';
        return html`
            ${CSS}
            <label class="checkbox ${checked}">
                <input type="checkbox" .checked="${this.checked}" @change=${this._handleChange}/>
                <span class="check"></span>
            </label>
        `;
    }

    private _handleChange(e: Event) {
        const newVal = (e.target as HTMLInputElement).checked;
        if (newVal !== this.checked) this.checked = newVal;
    }
}
