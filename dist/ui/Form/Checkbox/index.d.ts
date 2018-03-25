import Element from '../../../lib/Element';
export default class Checkbox extends Element {
    input: HTMLInputElement;
    constructor();
    checked: boolean;
    static readonly observedAttributes: string[];
    attributeChangedCallback(attr: keyof Checkbox, oldV: string, newV: string): void;
}
