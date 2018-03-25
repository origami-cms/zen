import '../imports';
import * as query from 'json-query';
import deepequal from 'deepequal';

interface TextNodeMapValue {
    words: string[];
    template: string;
}


export default class Element extends HTMLElement {
    static boundProps: string[] = [];
    static defaultProps: object = {};

    templates: {
        [key: string]: DocumentFragment
    } = {};

    private _cssLibHref: string = '/admin/origami.css';
    private _readyPromise: Promise<void>;
    private _textNodeMap: Map<Node, TextNodeMapValue> = new Map();
    private _css: string = '';
    private _cssLib = document.createElement('link');
    private _cssLibLoaded = false;
    protected _sr: ShadowRoot = this.shadowRoot as ShadowRoot;

    attributeChangedCallback(attr: string, oldV: string, newV: string): void {}


    constructor(html: string, css: string) {
        super();

        const c = (this.constructor as typeof Element);

        c.boundProps.forEach(p => {
            let prop: string;

            Object.defineProperty(this, p, {
                get: () => prop,
                set: async v => {
                    if (deepequal(prop, v)) return v;
                    const oldV = prop;
                    prop = v;
                    this.propertyChangedCallback(p, oldV, prop);
                    await this.ready();
                    this.render();

                    return v;
                },
                configurable: true
            });
        });

        // if (c.defaultProps) {
        //     Object.entries(c.defaultProps).forEach(([k, v]: [string, any]) => {
        //         this[k] = v;
        //     });
        // }

        this._readyPromise = new Promise(this.init(html, css));
    }

    init(html: string, css: string) {
        return (res: Function) => {
            this.attachShadow({mode: 'open'});

            this._cssLib.rel = 'stylesheet';
            this._cssLib.href = this._cssLibHref;
            this._cssLib.id = 'css-lib';
            this._cssLib.onload = () => {
                this.style.display = '';
                this._cssLibLoaded = true;
            };

            const c = (this.constructor as typeof Element);
            this._sr.appendChild(this._cssLib);
            this.css = css;

            if (html) this.html = html;
            this._updateTemplates();

            res();
        };
    }

    set html(v: string) {
        this._sr.innerHTML = v;
        // @ts-ignore: This does actually exist
        this._sr.prepend(this._cssLib);

        this.css = this._css;
        this._updateTemplates();
        this._updateTextNodeMap();
        this.render();
    }

    set css(v: string) {
        this._css = v;
        const style = document.createElement('style');
        style.innerHTML = v;
        this._sr.insertBefore(style, this._cssLib.nextElementSibling);
    }

    private _updateTemplates() {
        const ts = Array.from(this._sr.querySelectorAll('template'));
        ts.forEach(t => {
            if (t.id) this.templates[t.id] = t.content;
        });
    }

    propertyChangedCallback(prop: string, oldV: any, newV: any) {
    }


    connectedCallback() {
        if (!this._cssLibLoaded) this.style.display = 'none';

        this.render();
    }

    render() {
        const existing = Array.from(this._textNodeMap);
        for (const [node, {words, template}] of existing) {
            let replace = template;
            words.forEach(w => {
                // TODO: This is broken
                let replacement = undefined;
                // let {value: replacement} = query(w, {data: this});
                if (replacement === undefined) replacement = '';
                const r = new RegExp(`{{${w}}}`, 'g');
                replace = replace.replace(r, replacement);
            });

            node.nodeValue = replace;
        }
    }


    trigger(event: string, detail?: object, bubbles = true) {
        this._sr.dispatchEvent(new CustomEvent(event, {
            bubbles,
            detail
        }));
    }


    ready() {
        return this._readyPromise;
    }

    private _updateTextNodeMap() {
        // TODO: Move this to a Mutation Observer
        this._textNodeMap = new Map();
        const filter: NodeFilter = <NodeFilter><any>NodeFilter.SHOW_TEXT;
        const nodes = document.createTreeWalker(this._sr, NodeFilter.SHOW_TEXT, filter);
        let node = nodes.nextNode();
        while (node) {
            const template = node.nodeValue;
            if (!template) continue;

            // Retrieve all the {{var}} declerations in the template
            const m = template.match(/{{\s*[\w.]+\s*}}/g);

            if (m) {
                const words = m
                    .map(x => {
                        const res = x.match(/[\w.]+/);
                        if (!res) return null;
                        return res[0];
                    })
                    .filter(x => x != null);

                this._textNodeMap.set(node, {words, template} as TextNodeMapValue);
            }

            node = nodes.nextNode();
        }
    }
}
