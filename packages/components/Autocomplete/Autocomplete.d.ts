import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { InputDropdownResults } from '../../lib/FormValidator/FormFieldTypes';
import InputDropdown from '../InputDropdown/InputDropdown';
export interface props {
    placeholder?: string;
    name?: string;
    icon?: string;
    loading?: boolean;
    value?: string;
    query?: string;
    minlength?: number;
    options: Function | InputDropdownResults;
    _options: InputDropdownResults;
    _open: boolean;
}
/**
 * @class Zen Autocomplete
 * @example <zen-autocomplete>
 */
export default class Autocomplete extends LitElement implements props {
    /** Default text to show when there is no entered text */
    placeholder?: string;
    /** Name of the field */
    name?: string;
    /** Icon to display in the field */
    icon?: string;
    /** Displays a loading spinner on the right */
    loading?: boolean;
    /** Value of the selected item */
    value?: string;
    /** Inputted text */
    query?: string;
    /** Minimum number of characters to enter before searching */
    minlength?: number;
    options: Function | InputDropdownResults;
    _options: InputDropdownResults;
    _open: boolean;
    constructor();
    private _getResults(q?);
    _render({icon, placeholder, loading, _options, _open, query, value}: props): TemplateResult;
    _handleChange(e: {
        target: InputDropdown;
    }): void;
    private _updateQuery();
    _didRender(): void;
    _propertiesChanged(p: props, c: props, o: props): Promise<void>;
}
