import {html, LitElement} from '@polymer/lit-element';
import {component, property} from 'polymer3-decorators/dist';
import {style} from 'util/decorators';
import CSS from './checkbox.scss';

@component('zen-checkbox')
@style(CSS.toString())
export default class Checkbox extends LitElement {

    @property({reflectToAttribute: true})
    name?: string;

    @property({reflectToAttribute: true})
    size?: string;

    @property
    checked?: boolean;

    // tslint:disable-next-line function-name
    _render({checked}: {[key in keyof Checkbox]: any}) {
        return html`
            ${this._style}
            <label class="checkbox">
                <input type="checkbox" checked="${checked}"/>
                <span class="check"></span>
            </label>
        `;
    }
}
