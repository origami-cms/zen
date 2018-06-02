import { PolymerElement } from '@polymer/polymer';
import HTML from './radio.html';
import CSS from './radio.scss';
import {Icon} from '../..';
import { view } from 'util/decorators';
import { property, component, computed, observe } from 'polymer3-decorators/dist';
import '@polymer/polymer/lib/elements/dom-repeat';

@component('zen-radio')
@view(HTML, CSS.toString())
export default class Radio extends PolymerElement {

    @property
    options: {[key: string]: string} = {};

    value?: string;

    @property({reflectToAttribute: true})
    name?: string;


    _icon(item: {value: string}) {
        return (item.value === this.value) ? 'radio-checked' : 'radio-unchecked';
    }

    @computed
    private _options(options: object, value: string) {
        return Object.entries(options).map(([v, label]) => ({
            value: v,
            label
        }));
    }

    @observe('value')
    private _valueChanged(newV: string) {
        this.dispatchEvent(new CustomEvent('change'));
    }

    private _handleClick(e: Event) {
        // @ts-ignore Added by dom-repeat
        this.value = e.model.item.value;
    }
}
