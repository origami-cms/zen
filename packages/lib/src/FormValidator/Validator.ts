import { Field, Fieldsets, FormValues } from './FormFieldTypes';
import Rules, { ValidatorFunctions, ValidatorRules } from './rules';

/**
 * Options for constructing the validator
 */
export interface ValidatorConstructorOptions {
  fields?: Field[];
  fieldsets?: Fieldsets;
}

/**
 * Result returned from the main .validate() function
 */
export interface ValidatorResponse {
  valid: boolean;
  fields?: ValidateFieldErrors;
  fieldsets?: ValidateFieldsetErrors;
}

/**
 * Possible errors. Each key is a rule
 */
export interface ValidationErrors {
  [rule: string]: string;
}

/**
 * Map of field names and their errors
 */
export interface ValidateFieldErrors {
  [fieldName: string]: ValidationErrors;
}

/**
 * Map of fieldsets and their field errors
 */
export interface ValidateFieldsetErrors {
  [fieldset: string]: ValidateFieldErrors;
}

/**
 * Errors on a field
 */
export interface FieldErrors {
  field: string;
  errors: ValidationErrors;
}

export class Validator {
  private _fields: Field[];
  private _fieldsets: Fieldsets;
  private _defaultRules: object = {
    required: true
  };

  /**
   * Validate the values
   * @param  {Object} values Key value pair of form data
   * @return {Object}        Validate state for fieldset or fields
   */
  constructor({ fields, fieldsets }: ValidatorConstructorOptions) {
    this._fields = fields || [];
    this._fieldsets = fieldsets || {};
  }

  /**
   * Validates the form. Returns an object containing the validity, and the
   * possible errors for fields and fieldsets
   * @param values Form values to evaluate
   */
  public validate(values: FormValues): ValidatorResponse {
    let type: 'fields' | 'fieldsets' = 'fields';
    let state: true | ValidateFieldErrors | ValidateFieldsetErrors;

    if (this._fields) {
      state = this._validateFields(values);
    } else {
      state = this._validateFieldsets(values);
      type = 'fieldsets';
    }

    const returning: ValidatorResponse = { valid: state === true };
    if (state !== true) returning[type] = state;

    return returning;
  }

  /**
   * Validates the Validator's fieldsets with the given values
   * @param values Values of the form to be validated
   */
  private _validateFieldsets(
    values: FormValues
  ): true | ValidateFieldsetErrors {
    const state: ValidateFieldsetErrors = {};

    for (const [name, fields] of Object.entries(this._fieldsets)) {
      const result = this._validateFields(values, fields);
      if (result !== true) state[name] = result;
    }

    return Object.entries(state).length ? state : true;
  }

  /**
   * Gets a mapped object of form fields and their errors. Returns true if all
   * fields are valid.
   * @param values Form values to evaluate
   * @param fields Array of form fields
   */
  private _validateFields(
    values: FormValues,
    fields = this._fields
  ): true | ValidateFieldErrors {
    const _fields = fields.map((field) =>
      this._validateField(values[field.name], field)
    );

    const invalid = _fields.filter((item) => item !== true) as FieldErrors[];
    if (!invalid.length) return true;

    // Convert the errors into an object
    const errors: { [field: string]: ValidationErrors } = {};
    invalid.forEach((f) => (errors[f.field] = f.errors));

    return errors;
  }

  /**
   * Validate a single field based on it's rules and the value passed
   * @param  val    Value to validate
   * @param  field  Form field
   * @return True if valid, otherwise an object of errors
   */
  private _validateField(val: any, field: Field): true | FieldErrors {
    // If field is disabled or submit button, skip validation
    if (field.disabled || field.type === 'submit') return true;
    // If field is not required, and no value is passed, skip validation
    if (field.validate && !field.validate.required && !val) return true;

    const rules: ValidatorRules = { ...this._defaultRules, ...field.validate };
    const errors: ValidationErrors = {};
    const _R = Rules as { [key: string]: Function };

    // Loop over each of the rules
    for (const [rule, v] of Object.entries(rules)) {
      // @ts-ignore
      if (v !== false && rule !== 'require') {
        const validateFn = _R[rule as keyof ValidatorFunctions];

        if (!validateFn) {
          throw new Error(`Zen.UI.Validator: Invalid rule ${rule}`);
        }

        const err = validateFn(val, v);

        if (err) errors[rule] = err;
      }
    }

    // Default validation for certain field types
    switch (field.type) {
      case 'email':
        const e = _R['email'](val, true);
        if (e) errors['email'] = e;

        break;

      default:
        break;
    }

    return Object.entries(errors).length ? { field: field.name, errors } : true;
  }
}
