import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import FormRow from '../FormRow/FormRow';
import { Field, FormValues } from '../../lib/FormValidator/FormFieldTypes';
import { ValidateFieldErrors } from '../../lib/FormValidator/Validator';
export interface props {
    values: FormValues;
    error?: string;
    fields: Field[];
    loading: boolean;
    fieldErrors: ValidateFieldErrors;
    _validateOnChange: boolean;
    _showErrors: boolean;
}
export default class Form extends LitElement implements props {
    values: FormValues;
    error?: string;
    fields: Field[];
    loading: boolean;
    fieldErrors: ValidateFieldErrors;
    _validateOnChange: boolean;
    _showErrors: boolean;
    constructor();
    _render({error, fields, values, fieldErrors}: props): TemplateResult;
    scrollToError(): FormRow | undefined;
    submit(e?: Event): boolean;
    validate(showErrors?: boolean): boolean;
    _propertiesChanged(p: props, c: props, o: props): void;
    private _handleChange(e);
}
