import {PolymerElement} from '@polymer/polymer';
import '@polymer/polymer/lib/elements/dom-repeat';
import {FieldRadioOption} from 'lib/FormValidator/FormFieldTypes';
import {component, computed, property, observe} from 'polymer3-decorators/dist';
import {view} from 'util/decorators';
import HTML from './radio-tabs.html';
import CSS from './radio-tabs.scss';

@component('zen-radio-tabs')
@view(HTML, CSS.toString())
export default class RadioTabs extends PolymerElement {

    options: FieldRadioOption[] = [];
    value?: string;

    @property({reflectToAttribute: true})
    name?: string;

    @computed
    private _options(options: FieldRadioOption, value: string) {
        return Object.entries(options).map(([v, label]) => ({
            label,
            value: v,
            checked: v === this.value
        }));
    }

    private _active(item: {checked: boolean}) {
        return item.checked ? 'active' : '';
    }

    private _handleClick(e: Event) {
        // @ts-ignore Added by dom-repeat
        this.value = e.model.item.value;
        this.$.options.modelForElement(e.target).set('item.checked', true);
    }

    @observe('value')
    private _valueChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('change'));
    }
}
