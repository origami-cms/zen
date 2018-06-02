import HTML from './input.template.html';
import CSS from './input.scss';
import { PolymerElement } from '@polymer/polymer';
import { component, property, observe } from 'polymer3-decorators/dist';
import { view } from 'util/decorators';

@component('zen-input')
@view(HTML, CSS.toString())
export default class Input extends PolymerElement {

    @property({reflectToAttribute: true})
    placeholder?: string;

    @property({reflectToAttribute: true})
    name?: string;

    @property({reflectToAttribute: true})
    type: string = 'text';

    @property({reflectToAttribute: true})
    icon?: string;

    @property({reflectToAttribute: true})
    loading?: boolean;

    @property
    value?: string;

    @observe('value')
    private _valueChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('change'));
    }
}
