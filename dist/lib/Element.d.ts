import '../imports';
export default class Element extends HTMLElement {
    static boundProps: string[];
    static defaultProps: object;
    templates: {
        [key: string]: DocumentFragment;
    };
    private _cssLibHref;
    private _readyPromise;
    private _textNodeMap;
    private _css;
    private _cssLib;
    private _cssLibLoaded;
    protected _sr: ShadowRoot;
    attributeChangedCallback(attr: string, oldV: string, newV: string): void;
    constructor(html: string, css: string);
    init(html: string, css: string): (res: Function) => void;
    html: string;
    css: string;
    private _updateTemplates();
    propertyChangedCallback(prop: string, oldV: any, newV: any): void;
    connectedCallback(): void;
    render(): void;
    trigger(event: string, detail?: object, bubbles?: boolean): void;
    ready(): Promise<void>;
    _updateTextNodeMap(): void;
}
