import Rules from './rules';
export default class Validator {
    /**
     * Validate the values
     * @param  {Object} values Key value pair of form data
     * @return {Object}        Validate state for fieldset or fields
     */
    constructor({ fields, fieldsets }) {
        this._defaultRules = {
            required: true
        };
        this._fields = fields || [];
        this._fieldsets = fieldsets || {};
    }
    /**
     * Validates the form. Returns an object containing the validity, and the
     * possible errors for fields and fieldsets
     * @param values Form values to evaluate
     */
    validate(values) {
        let type = 'fields';
        let state;
        if (this._fields) {
            state = this._validateFields(values);
        }
        else {
            state = this._validateFieldsets(values);
            type = 'fieldsets';
        }
        const returning = { valid: state === true };
        if (state !== true)
            returning[type] = state;
        return returning;
    }
    /**
     * Validates the Validator's fieldsets with the given values
     * @param values Values of the form to be validated
     */
    _validateFieldsets(values) {
        const state = {};
        for (const [name, fields] of Object.entries(this._fieldsets)) {
            const result = this._validateFields(values, fields);
            if (result !== true)
                state[name] = result;
        }
        return Object.entries(state).length ? state : true;
    }
    /**
     * Gets a mapped object of form fields and their errors. Returns true if all
     * fields are valid.
     * @param values Form values to evaluate
     * @param fields Array of form fields
     */
    _validateFields(values, fields = this._fields) {
        const _fields = fields.map(field => this._validateField(values[field.name], field));
        const invalid = _fields.filter(item => item !== true);
        if (!invalid.length)
            return true;
        // Convert the errors into an object
        const errors = {};
        invalid.forEach(f => errors[f.field] = f.errors);
        return errors;
    }
    /**
     * Validate a single field based on it's rules and the value passed
     * @param  val    Value to validate
     * @param  field  Form field
     * @return True if valid, otherwise an object of errors
     */
    _validateField(val, field) {
        // If field is disabled or submit button, skip validation
        if (field.disabled || field.type === 'submit')
            return true;
        // If field is not required, and no value is passed, skip validation
        if (field.validate && !field.validate.required && !val)
            return true;
        const rules = Object.assign({}, this._defaultRules, field.validate);
        const errors = {};
        const _R = Rules;
        // Loop over each of the rules
        for (const [rule, v] of Object.entries(rules)) {
            // @ts-ignore
            if (v !== false && rule !== 'require') {
                const validateFn = _R[rule];
                if (!validateFn)
                    throw new Error(`Zen.UI.Validator: Invalid rule ${rule}`);
                const err = validateFn(val, v);
                if (err)
                    errors[rule] = err;
            }
        }
        // Default validation for certain field types
        switch (field.type) {
            case 'email':
                const e = _R['email'](val, true);
                if (e)
                    errors['email'] = e;
                break;
            default:
                break;
        }
        return Object.entries(errors).length ? { field: field.name, errors } : true;
    }
}
