import { LitElement } from '@polymer/lit-element';
import { ValidationErrors } from '../../lib/FormValidator';
import { Field } from '../../lib/FormValidator/FormFieldTypes';
import { TemplateResult } from 'lit-html';
export interface props {
    field?: Field;
    name?: string;
    value?: any;
    error?: ValidationErrors;
    rowwidth?: 'half';
    hidden: boolean;
}
export default class FormRow extends LitElement implements props {
    field?: Field;
    name?: string;
    value?: any;
    error?: ValidationErrors;
    rowwidth?: 'half';
    hidden: boolean;
    static _boundAttributes: string[];
    constructor();
    _render({error, field, value}: props): TemplateResult;
    private _handleChange(e);
    private submit();
    _renderField(f: Field, value: any): TemplateResult | undefined;
}
