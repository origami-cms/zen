import {html, LitElement} from '@polymer/lit-element';
import {component, property} from 'polymer3-decorators/dist';
import {style, dispatchChange} from 'util/decorators';
import CSS from './checkbox-css';

@component('zen-checkbox')
@dispatchChange('checked')
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
            ${CSS}
            <label class="checkbox">
                <input type="checkbox" checked="${checked}" on-change=${e => this.checked = e.target.checked}/>
                <span class="check"></span>
            </label>
        `;
    }
}
