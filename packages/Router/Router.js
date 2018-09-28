var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { html, LitElement } from '@polymer/lit-element';
import { unsafeHTML } from 'lit-html/lib/unsafe-html';
// @ts-ignore
import { installRouter } from 'pwa-helpers/router';
import { property } from '@origamijs/zen-lib/lib/decorators';
import matchPath from '@origamijs/zen-lib/lib/Path';
export default class Router extends LitElement {
    constructor() {
        super(...arguments);
        this.path = window.location.pathname;
        this.routes = [];
        this.base = '/';
        /** Only show one route */
        this.switch = true;
    }
    _firstRendered() {
        // Setup to watch the location and bind to redux store
        installRouter((location) => {
            this._store.dispatch(
            // @ts-ignore
            App.navigate(window.decodeURIComponent(location.pathname)));
        });
    }
    _render({ path, routes, base }) {
        const pages = this._getRoutes(this.routes, base, path);
        if (!pages.length && this.notfound) {
            pages.push(this._renderElement({ element: this.notfound, path: '' }));
        }
        return html `${pages}`;
    }
    _getRoutes(routes, base, path) {
        const r = [...routes]
            // Match each route against the current location
            .filter(r => {
            return matchPath(path, {
                path: this.base + r.path,
                exact: r.exact,
                strict: false
            });
            // if (params) return {params: params.params, element: r.element};
        })
            // Convert each valid route to a html template
            .map(r => this._renderElement(r));
        if (!r.length)
            return [];
        return this.switch ? [r[0]] : r;
    }
    _renderElement(r) {
        let attrs = '';
        if (r.attributes) {
            attrs = Object.entries(r.attributes)
                .map(([attr, val]) => `${attr}="${val}"`)
                .join(' ');
        }
        // TODO: Pass in props
        const unsafe = `<${r.element} ${attrs}></${r.element}>`;
        return html `${unsafeHTML(unsafe)}`;
    }
}
__decorate([
    property,
    __metadata("design:type", String)
], Router.prototype, "path", void 0);
__decorate([
    property,
    __metadata("design:type", Array)
], Router.prototype, "routes", void 0);
__decorate([
    property,
    __metadata("design:type", String)
], Router.prototype, "base", void 0);
__decorate([
    property,
    __metadata("design:type", String)
], Router.prototype, "notfound", void 0);
__decorate([
    property,
    __metadata("design:type", Boolean)
], Router.prototype, "switch", void 0);
