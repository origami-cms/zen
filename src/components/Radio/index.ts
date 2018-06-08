import {LitElement} from '@polymer/lit-element';
import {html} from 'lit-html/lib/lit-extended';
import {component, property} from 'polymer3-decorators/dist';
import {dispatchChange} from 'util/decorators';
import CSS from './radio-css';

interface props {
    options: { [key: string]: string };
    value?: string;
    name?: string;
}

@component('zen-radio')
@dispatchChange()
export default class Radio extends LitElement implements props {

    @property
    options = {};

    @property
    value?: string;

    @property
    name?: string;


    _render({value, options}: props) {
        const opts = Object.entries(options).map(([v, label]) => ({
            value: v,
            label
        }));

        return html`
            ${CSS}
            <div class="options">
                ${opts.map(o => {
                    return html`
                        <div class="option" on-click=${() => this.value = o.value}>
                            <zen-icon type="${value === o.value ? 'radio-checked' : 'radio-unchecked'}"></zen-icon>
                            <span>${o.label}</span>
                        </div>
                    `;
                })}
            </div>
        `;
    }
}
