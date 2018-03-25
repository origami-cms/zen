import Element from '../../lib/Element';
import './Checkbox';
export declare type FieldType = 'text' | 'submit' | 'textarea' | 'input' | 'password' | 'email';
export interface Field {
    name: string;
    type: FieldType;
    value?: any;
    icon?: string;
    iconColor?: string;
    placeholder?: string;
    color?: string;
}
export default class ZenForm extends Element {
    form: HTMLFormElement;
    error: string | null;
    values: {
        [key: string]: any;
    };
    fields: Field[];
    constructor();
    connectedCallback(): void;
    static readonly boundProps: string[];
    static readonly observedAttributes: string[];
    private readonly _fieldOrder;
    propertyChangedCallback(prop: string, oldV: string, newV: string): Promise<void>;
    updateError(): void;
    render(): void;
    private _updateExistingRow(f, v);
    private _createRow(f, v);
    private _createField(f, v);
    submit(e: Event): boolean;
}
