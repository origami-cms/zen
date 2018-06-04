import {PolymerElement} from '@polymer/polymer';
import '@polymer/polymer/lib/elements/dom-repeat';
import {ValidationErrors} from 'lib/FormValidator';
import {Field} from 'lib/FormValidator/FormFieldTypes';
import {component, computed, observe, property} from 'polymer3-decorators/dist';
import {view} from 'util/decorators';
import CSS from './form-row.scss';
import HTML from './form-row.template.html';

@component('zen-form-row')
@view(HTML, CSS.toString())
export default class FormRow extends PolymerElement {
    field?: Field;

    @property({reflectToAttribute: true})
    name?: string;

    @property({})
    value?: any;
    type?: string;
    error: string | null = null;
    hidden: boolean = false;

    // Compare the field types
    private _is(type: string, ...types: string[]) {
        return types.includes(type);
    }

    @observe('value')
    private _handleChange(newV: any) {
        this.dispatchEvent(new CustomEvent('change'));
    }

    @computed
    private _error(error: ValidationErrors) {
        if (!error) return false;
        return Object.values(error)[0];
    }
}
