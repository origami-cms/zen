import { LitElement } from '@polymer/lit-element';
import { Field, FormValues } from '../../lib/FormValidator/FormFieldTypes';
import { ValidateFieldErrors } from '../../lib/FormValidator/Validator';
import { TemplateResult } from 'lit-html';
export interface props {
    values: FormValues;
    error?: string;
    fields: Field[];
    loading: boolean;
    _fieldErrors: ValidateFieldErrors;
    _validateOnChange: boolean;
    _showErrors: boolean;
}
export default class Form extends LitElement implements props {
    values: FormValues;
    error?: string;
    fields: Field[];
    loading: boolean;
    _fieldErrors: ValidateFieldErrors;
    _validateOnChange: boolean;
    _showErrors: boolean;
    constructor();
    _render({error, fields, values, _fieldErrors}: props): TemplateResult;
    submit(e: Event): boolean;
    validate(showErrors?: boolean): boolean;
    _propertiesChanged(p: props, c: props, o: props): void;
    private _handleChange(e);
}
