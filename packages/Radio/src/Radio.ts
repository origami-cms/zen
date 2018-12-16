import { component, dispatchChange, property } from '@origami/zen-lib/lib/decorators';
import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { html } from '@polymer/lit-element';
import CSS from './radio-css';


export interface RadioProps {
    options: { [key: string]: string };
    value: string | null;
    name?: string;
}

@component('zen-radio')
@dispatchChange()
export class Radio extends LitElement implements RadioProps {

    @property
    options = {};

    @property
    value: string | null = null;

    @property
    name?: string;


    render(): TemplateResult {
        const { value, options } = this;

        const opts = Object.entries(options).map(([v, label]) => ({
            value: v,
            label
        }));

        return html`
            ${CSS}
            <div class="options">
                ${opts.map(o => {
                    return html`
                        <div class="option" @click=${() => this.value = o.value}>
                            <zen-icon type="${value === o.value ? 'radio-checked' : 'radio-unchecked'}"></zen-icon>
                            <span>${o.label}</span>
                        </div>
                    `;
                })}
            </div>
        `;
    }
}
