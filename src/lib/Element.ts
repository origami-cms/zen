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

    private readonly _readyPromise: Promise<void>;
    private _textNodeMap: Map<Node, TextNodeMapValue> = new Map();
    private _html: string;
    private _css: string | null;
    private _cssStyleTag: HTMLStyleElement | null = null;
    private readonly _name: string;
    private readonly _useShadowRoot: boolean;


    attributeChangedCallback(attr: string, oldV: string, newV: string): void {}


    constructor(html: string, css: string | false, name: string, useShadowRoot: boolean = true) {
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
        this._name = name;
        this._useShadowRoot = useShadowRoot;

        this._html = html;
        this._css = css || null;

        this._readyPromise = this._useShadowRoot
            ? new Promise(this._initShadow())
            : Promise.resolve();
    }

    protected get _root(): ShadowRoot | this {
        return this._useShadowRoot
            ? this.shadowRoot as ShadowRoot
            : this;
    }

    private _initShadow() {
        return (res: Function) => {
            if (this._useShadowRoot) this.attachShadow({mode: 'open'});

            this._setupDOM();

            res();
        };
    }

    private _setupDOM() {
        const c = (this.constructor as typeof Element);
        if (this._css) {
            this.css = this._css;
        }

        if (this._html) this.html = this._html;
        this._updateTemplates();
    }

    set html(v: string) {
        this._root.innerHTML = v;

        this.css = this._css;
        this._updateTemplates();
        this._updateTextNodeMap();
        this.render();
    }

    set css(v: string | null) {
        this._css = v;

        // If the css is set to null, remove the style tag
        if (!v) {
            if (this._cssStyleTag) this._cssStyleTag.remove();
            this._cssStyleTag = null;
            return;
        }

        if (!this._cssStyleTag) this._cssStyleTag = document.createElement('style');
        this._cssStyleTag.innerHTML = v;
        this._root.insertBefore(this._cssStyleTag, this._root.firstChild);
    }

    get css(): string | null {
        if (!this._cssStyleTag) return null;
        return this._cssStyleTag.innerText;
    }



    private _updateTemplates() {
        const ts = Array.from(this._root.querySelectorAll('template'));
        ts.forEach(t => {
            if (t.id) this.templates[t.id] = t.content;
        });
    }

    propertyChangedCallback(prop: string, oldV: any, newV: any) {
    }


    connectedCallback() {
        if (!this._useShadowRoot) this._setupDOM();
        // if (!this._cssLibLoaded) this.style.display = 'none';

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
        this._root.dispatchEvent(new CustomEvent(event, {
            bubbles,
            detail
        }));
    }


    ready() {
        return this._readyPromise;
    }

    // Throw a named error
    protected _error(msg: string) {
        throw new Error(`Zen.UI.${this._name}: ${msg}`);
    }

    private _updateTextNodeMap() {
        // TODO: Move this to a Mutation Observer
        this._textNodeMap = new Map();
        const filter: NodeFilter = <NodeFilter><any>NodeFilter.SHOW_TEXT;
        const nodes = document.createTreeWalker(this._root, NodeFilter.SHOW_TEXT, filter);
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
