import {LitElement} from '@polymer/lit-element';
import {html} from 'lit-html/lib/lit-extended';
import {component, property} from 'polymer3-decorators/dist';
import {style} from 'util/decorators';
import CSS from './radio.scss';

@component('zen-radio')
@style(CSS.toString())
export default class Radio extends LitElement {

    @property
    options: {[key: string]: string} = {};

    @property
    value?: string;

    @property
    name?: string;

    // tslint:disable-next-line function-name
    _render({value, options}: {[key in keyof Radio]: any}) {
        const opts = Object.entries(options).map(([v, label]) => ({
            value: v,
            label
        }));

        return html`
            ${this._styles}
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
