import {PolymerElement} from '@polymer/polymer';
import HTML from './radio-icons.html';
import CSS from './radio-icons.scss';
import {Icon} from '../..';
import {view} from 'util/decorators';
import {property, component, computed, observe} from 'polymer3-decorators/dist';
import '@polymer/polymer/lib/elements/dom-repeat';
import {FieldRadioIconsOption} from 'lib/FormValidator/FormFieldTypes';

@component('zen-radio-icons')
@view(HTML, CSS.toString())
export default class RadioIcons extends PolymerElement {

    options: FieldRadioIconsOption[] = [];
    value?: string;

    @property({reflectToAttribute: true})
    name?: string;

    @property({reflectToAttribute: true})
    columns?: number;

    @computed
    private _options(options: FieldRadioIconsOption, value: string) {
        return this.options.map(o => ({
            ...o,
            checked: o.value === this.value
        }));
    }

    private _active(item: {checked: boolean}) {
        return item.checked ? 'active' : '';
    }

    @observe('columns')
    private _columnsChanged(newV: number) {
        this.style.setProperty(
            '--radio-icons-columns',
            `var(--radio-icons-columns-override, ${newV})`
        );
    }

    @observe('value')
    private _valueChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('change'));
    }

    private _handleClick(e: Event) {
        // @ts-ignore Added by dom-repeat
        this.value = e.model.item.value;
        this.$.options.modelForElement(e.target).set('item.checked', true);
    }
}
