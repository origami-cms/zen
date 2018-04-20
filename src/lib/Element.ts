import detect from 'browser-detect';
import {BrowserDetectInfo} from 'browser-detect/dist/types/browser-detect.interface';
import deepequal from 'deepequal';
import {query} from 'jsonpath';
import '../imports';

export interface TextNodeMapValue {
    words: string[];
    template: string;
}

export type TemplateMap = Map<Node, TextNodeMapValue>;

export default class Element extends HTMLElement {
    static boundProps: string[] = [];
    static defaultProps: object = {};

    templates: {
        [key: string]: DocumentFragment
    } = {};


    // @ts-ignore Set automatically
    isConnected: boolean;
    protected readonly _browser: BrowserDetectInfo;

    private readonly _readyPromise: Promise<void>;
    private _textNodeMap: TemplateMap = new Map();
    private _html: string;
    private _css: string | null;
    private _cssStyleTag: HTMLStyleElement | null = null;
    private readonly _name: string;
    private readonly _useShadowRoot: boolean;


    attributeChangedCallback(attr: string, oldV: string, newV: string): void {}


    constructor(html: string, css: string | false, name?: string, useShadowRoot: boolean = true) {
        super();


        this._browser = detect();


        const c = (this.constructor as typeof Element);

        c.boundProps.forEach((p: string) => {
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

        this._name = name || 'ZenElement';
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

    private get _needsPolyfill(): boolean {
        return ['firefox'].includes(this._browser.name || '');
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
        this._textNodeMap = this._getTemplateMap();
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
        this._updateTemplateNodes(this._textNodeMap);
    }


    trigger(event: string, detail?: object | string, bubbles = true) {
        this.dispatchEvent(new CustomEvent(event, {
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

    // Show named console warning
    protected _warn(msg: string) {
        console.warn(`Zen.UI.${this._name}: ${msg}`);
    }

    // Recursively get a map of nodes that contain {{variable}} so they can be
    // updated later
    protected _getTemplateMap(
        root: ShadowRoot | HTMLElement | DocumentFragment | this = this._root
    ): TemplateMap {
        // TODO: Move this to a Mutation Observer
        const textNodeMap: TemplateMap = new Map();
        const filter: NodeFilter = <NodeFilter><any>NodeFilter.SHOW_TEXT;

        const n = this._needsPolyfill ? this : root;
        const nodes = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
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

                textNodeMap.set(node, {words, template} as TextNodeMapValue);
            }

            node = nodes.nextNode();
        }

        return textNodeMap;
    }

    // Loop over a TemplateMap, and replace the text nodes with data keys
    protected _updateTemplateNodes(templateNodeMap: TemplateMap, data: object = this) {
        const existing = Array.from(templateNodeMap);
        for (const [node, {words, template}] of existing) {
            let replace = template;
            words.forEach(w => {
                let replacement: any = query(data, w);

                if (replacement instanceof Array && replacement.length === 1) {
                    replacement = replacement[0];
                }

                if (
                    replacement === undefined ||
                    replacement === null
                ) replacement = ' ';

                const r = new RegExp(`{{${w}}}`, 'g');
                replace = replace.replace(r, replacement);
            });

            node.nodeValue = replace;
        }
    }

    protected _renderTemplate(template: string, data: object = this): DocumentFragment {
        const t = this.templates[template];
        if (!t) {
            this._error(`Could not render template ${template}. Template does not exist`);
        }

        const tn: DocumentFragment = document.importNode(this.templates[template], true);
        const nodeMap: TemplateMap = this._getTemplateMap(tn);
        this._updateTemplateNodes(nodeMap, data);

        return tn;
    }

    protected _renderTemplateString(template: string, data: object = this): string | null {
        const doc = new DocumentFragment();
        const tn = document.createTextNode(template);
        doc.appendChild(tn);

        const nodeMap: TemplateMap = this._getTemplateMap(doc);
        this._updateTemplateNodes(nodeMap, data);

        return tn.nodeValue;
    }
}
