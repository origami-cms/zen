import {PolymerElement} from '@polymer/polymer';
import {Field, FormValues} from 'lib/FormValidator/FormFieldTypes';
import Validator, {ValidateFieldErrors, ValidationErrors, FieldErrors} from 'lib/FormValidator/Validator';
import {isEqual} from 'lodash';
import {Button, FormRow} from '..';
import {property, component, observe, computed} from 'polymer3-decorators/dist';
import {view} from 'util/decorators';
import HTML from './form.template.html';
import CSS from './form.scss';

@component('zen-form')
@view(HTML, CSS.toString())
export default class Form extends PolymerElement {
    @property
    values: FormValues = {};

    @property
    error?: string;

    @property
    fields: Field[] = [];

    @property({reflectToAttribute: true})
    loading: boolean = false;

    private _fieldErrors?: ValidateFieldErrors;
    private _validateOnChange: boolean = false;
    private _showErrors: boolean = false;

    private get _form() {
        return this.shadowRoot.querySelector('form') as HTMLFormElement;
    }

    submit(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.validate()) return false;

        const active = this.shadowRoot.querySelector('*:focus') as HTMLElement;
        if (active && active.blur) active.blur();

        this.dispatchEvent(new CustomEvent('submit'));

        return false;
    }

    validate(showErrors: boolean = true) {
        this._validateOnChange = true;
        this._showErrors = showErrors;

        const v = new Validator({
            fields: this.fields
        });

        const {valid, fields} = v.validate(this.values);

        this._fieldErrors = fields;

        this.dispatchEvent(new CustomEvent('validated', {
            detail: {valid}
        }));

        return valid;
    }

    private _fieldValue(values: FormValues, field: Field) {
        return values[field.name];
    }

    private _fieldError(errors: ValidateFieldErrors, field: Field) {
        if (!errors) return false;
        return errors[field.name];
    }

    @observe('values')
    private _valuesChanged(newV: FormValues) {
        if (this._showErrors) this.validate();
        this.dispatchEvent(new CustomEvent('changed'));
    }

    private _handleChange(e: Event) {
        // @ts-ignore
        this.values = {...this.values, ...{[e.target.name]: e.target.value}};
    }
}
