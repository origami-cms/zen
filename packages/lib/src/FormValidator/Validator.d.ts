import { Field, Fieldsets, FormValues } from './FormFieldTypes';
/** Options for constructing the validator */
export interface ValidatorConstructorOptions {
    fields?: Field[];
    fieldsets?: Fieldsets;
}
/** Result returned from the main .validate() function */
export interface ValidatorResponse {
    valid: boolean;
    fields?: ValidateFieldErrors;
    fieldsets?: ValidateFieldsetErrors;
}
/** Possible errors. Each key is a rule */
export interface ValidationErrors {
    [rule: string]: string;
}
/** Map of field names and their errors */
export interface ValidateFieldErrors {
    [fieldName: string]: ValidationErrors;
}
/** Map of fieldsets and their field errors */
export interface ValidateFieldsetErrors {
    [fieldset: string]: ValidateFieldErrors;
}
/** Errors on a field */
export interface FieldErrors {
    field: string;
    errors: ValidationErrors;
}
export default class Validator {
    private _fields;
    private _fieldsets;
    private _defaultRules;
    /**
     * Validate the values
     * @param  {Object} values Key value pair of form data
     * @return {Object}        Validate state for fieldset or fields
     */
    constructor({fields, fieldsets}: ValidatorConstructorOptions);
    /**
     * Validates the form. Returns an object containing the validity, and the
     * possible errors for fields and fieldsets
     * @param values Form values to evaluate
     */
    validate(values: FormValues): ValidatorResponse;
    /**
     * Validates the Validator's fieldsets with the given values
     * @param values Values of the form to be validated
     */
    private _validateFieldsets(values);
    /**
     * Gets a mapped object of form fields and their errors. Returns true if all
     * fields are valid.
     * @param values Form values to evaluate
     * @param fields Array of form fields
     */
    private _validateFields(values, fields?);
    /**
     * Validate a single field based on it's rules and the value passed
     * @param  val    Value to validate
     * @param  field  Form field
     * @return True if valid, otherwise an object of errors
     */
    private _validateField(val, field);
}
