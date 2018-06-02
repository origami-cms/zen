import { PolymerElement } from '@polymer/polymer';
import '@polymer/polymer/lib/elements/dom-repeat';
import { FieldSelectOptions } from 'lib/FormValidator/FormFieldTypes';
import { component, computed, property, observe } from 'polymer3-decorators/dist';
import { view } from 'util/decorators';
import HTML from './select.template.html';
import CSS from './select.scss';

@component('zen-select')
@view(HTML, CSS.toString())
export default class Select extends PolymerElement {

    options: FieldSelectOptions[] = [];
    value?: string;

    @property({ reflectToAttribute: true })
    name?: string;

    private _open?: boolean;

    @observe('value')
    private _valueChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('change'));
    }

    private _toggleOpen() {
        this._open = !this._open;
    }
}
