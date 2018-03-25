import Element from '../../lib/Element';
export default class Icon extends Element {
    size: string;
    type: string;
    color: string;
    readonly html: string;
    private _prefix;
    constructor();
    readonly svg: SVGElement;
    readonly use: SVGUseElement;
    static readonly defaultProps: {
        'color': string;
        'size': string;
    };
    static readonly boundProps: string[];
    static readonly observedAttributes: string[];
    attributeChangedCallback(attr: keyof Icon, oldV: string, newV: string): void;
    propertyChangedCallback(prop: string, oldV: string, newV: string): Promise<void>;
    render(): void;
}
