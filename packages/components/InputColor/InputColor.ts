import {LitElement, html} from '@polymer/lit-element';
import CSS from './input-color-css';
import {component, property} from 'polymer3-decorators';

interface props {
    value: string | null;
}

@component('zen-input-color')
export default class InputColor extends LitElement implements props {
    @property
    value: string | null = null;

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this);
    }

    _render({value}: props) {
        return html`
            ${CSS}
            <div class="color" style="background-color: ${value}">
                <zen-icon type="eyedropper" color="white"></zen-icon>
            </div>
            <span>${value}</span>
            <input type="color" on-change=${this._handleChange}>
        `;
    }

    private _handleChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.value = input.value;
    }
}
