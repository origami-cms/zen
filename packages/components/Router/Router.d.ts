import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface Route {
    path: string;
    exact?: boolean;
    element: string;
    attributes?: {
        [prop: string]: string | number | boolean;
    };
}
export interface RouterProps {
    path: string;
    routes: Route[];
    base: string;
    switch: boolean;
}
export default class Router extends LitElement implements RouterProps {
    path: string;
    routes: Route[];
    base: string;
    notfound?: string;
    /** Only show one route */
    switch: boolean;
    protected _store: any;
    _firstRendered(): void;
    _render({path, routes, base}: RouterProps): TemplateResult;
    _getRoutes(routes: Route[], base: string, path: string): TemplateResult[];
    _renderElement(r: Route): TemplateResult;
}
