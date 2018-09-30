import { LitElement, html, property, customElement } from '@polymer/lit-element';
import UniversalRouter, { Route } from 'universal-router';
import { TemplateResult } from 'lit-html';
// import {component} from '@origamijs/zen-lib/lib/decorators';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
// @ts-ignore
import { installRouter } from 'pwa-helpers';
import match from 'path-to-regexp';

// Event name for the window to trigger location changing to sync across
// multiple <zen-routers>
const EVENT_NAME = 'RouterPop';


export interface RouteBase {
    path: string;
    exact?: boolean;
}

export interface RouteWithElement extends RouteBase {
    element?: string;
    attributes?: { [prop: string]: string | number | boolean };
}

export interface RouteWithTemplate extends RouteBase {
    template: string | Function;
}

export type ZenRoute = RouteWithElement | RouteWithTemplate;


export interface RouterProps {
    routes: ZenRoute[];
    base: string;
}

// @ts-ignore
@customElement('zen-router')
export class Router extends LitElement implements RouterProps {

    @property({ attribute: true, type: Array })
    routes: ZenRoute[] = [];

    @property()
    base = '';

    @property({type: String})
    notfound?: string;

    @property()
    private _path: string = window.location.pathname;


    private _router?: UniversalRouter<{}, TemplateResult>;
    private _routesCache: {
        [path: string]: TemplateResult
    } = {}


    constructor() {
        super();
        this._updatePath = this._updatePath.bind(this);
    }


    connectedCallback() {
        super.connectedCallback();
        // Register click and pop events for the window
        installRouter(this._handleChange.bind(this));

        // When the window triggers the custom event, update the path
        window.addEventListener(EVENT_NAME, this._updatePath);
        window.addEventListener('popstate', this._updatePath);
    }


    disconnectedCallback() {
        window.removeEventListener(EVENT_NAME, this._updatePath);
    }


    // Compare the old active path with the new one, and if they're different,
    // allow for an update
    shouldUpdate(oldProps: any) {
        const oldPath = oldProps.get('_path');
        if (!oldPath) return true;

        const oldActive = this.activeRoute(oldPath);
        const active = this.activeRoute();

        return oldActive !== active;
    }


    render() {
        // Resolve a route promise
        return html`${this.route()}`;
    }


    // Loop over each route, and find the first one that matches with the given
    // path. This should mirror the universal-router route match.
    activeRoute(path = this._path) {
        return this.routes.find(r =>
            match(this.base + r.path, undefined, {
                end: false,
                strict: false
            }).test(path)
        );
    }


    // Lookup and cache the active route
    async route(path: string = this._path) {
        if (!this._router) return null;

        // Find the current route from the current path
        const activeRoute = this.activeRoute();
        let activeRoutePath = path;
        if (activeRoute) activeRoutePath = activeRoute.path;

        // Find route in cache first...
        // if (this._routesCache[activeRoutePath]) return this._routesCache[activeRoutePath];

        // Otherwise save it to the cache
        return this._routesCache[activeRoutePath] = await this._router.resolve(path);
    }


    // Cast zen routes to universal-router routes
    get _routes() {
        return this.routes.map(r => {
            // Universal-router route...
            const route: Route<{}, TemplateResult> = {
                path: r.path,
            }

            // If route has template...
            if ((r as RouteWithTemplate).template) {
                const _r = r as RouteWithTemplate;
                // If route template is a string, return it
                if (typeof _r.template === 'string') route.action = () => html`${
                    unsafeHTML(_r.template)
                    }`;

                // If route template is an action, run it
                else route.action = (ctx, params) => html`${
                    unsafeHTML((_r.template as Function).call(this, ctx, params))
                    }`;


                // If the route is an element, render it with attributes
            } else if ((r as RouteWithElement).element) {
                route.action = () => {
                    r = r as RouteWithElement
                    let attrs = '';

                    // Build the attributes string
                    if (r.attributes) {
                        attrs = Object.entries(r.attributes)
                            .map(([attr, val]) => `${attr}= '${val}'`)
                            .join(' ');
                    }
                    return this._generateElement(r.element!, attrs);
                }
            }

            return route;
        });
    }


    // If the routes are changed, create a new router, clear the cache and update
    updated(p: any) {
        super.updated(p);

        if ((p.has('routes') || !this._router) && this.routes.length) {
            this._router = new UniversalRouter(this._routes, {
                errorHandler: this._errorHandler.bind(this),
                baseUrl: this.base
            });
            // Reset the cache because there are new routes
            this._routesCache = {};
            this.requestUpdate();
        }
    }


    private _errorHandler(err: Error) {
        if (this.notfound) {
            return this._generateElement(this.notfound);
        } else {
            return html`Page not found`;
        }
    }

    private _generateElement(element: string, attrs: string = '') {
        return html`${unsafeHTML(`<${element} ${attrs}></${element}>`)}`;
    }


    // Update the router on location change
    // If there are more than one zen-router on the page, this will only
    // run on the first one. It then trigger's a custom event on the window
    // for all zen-router's to update to
    private _handleChange() {
        window.dispatchEvent(new Event(EVENT_NAME));
    }

    private _updatePath() {
        const newPath = window.location.pathname;

        if (this._path !== newPath) {
            this._path = window.location.pathname;
            this.dispatchEvent(new CustomEvent('updated'));
        }
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'zen-router': Router;
    }
}
