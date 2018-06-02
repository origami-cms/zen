import { PolymerElement } from '@polymer/polymer';
import HTML from './checkbox.html';
import CSS from './checkbox.scss';
import { component, property, observe } from 'polymer3-decorators/dist';
import { view } from 'util/decorators';


@component('zen-checkbox')
@view(HTML, CSS.toString())
export default class Checkbox extends PolymerElement {

    @property({reflectToAttribute: true})
    name: string | undefined = undefined;

    @property({reflectToAttribute: true})
    size?: string;

    @property
    checked?: boolean;

    @observe('checked')
    private _checkedChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('change'));
    }
}
