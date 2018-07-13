import { LitElement } from '@polymer/lit-element';
import { html, TemplateResult } from 'lit-html';
import { component, property } from 'polymer3-decorators';
// @ts-ignore
import { installRouter } from 'pwa-helpers/router';

export interface props {
    href?: string;
}

@component('zen-link')
// @bindAttributes
export default class Link extends LitElement implements props {
    @property
    href?: string;

    // static _boundAttributes = ['href'];

    connectedCallback() {
        const time = 3; // Time to delay sending pop state

        super.connectedCallback();

        this.addEventListener('click', () => {

            if (this.href && window.location.pathname !== this.href) {
                setTimeout(() => {
                    dispatchEvent(new PopStateEvent('popstate', { state: {} }));
                }, time);
                window.history.pushState({}, '', this.href);
            }
        });
    }

    _firstRendered() {
        installRouter(this._updateClass.bind(this));
    }

    _render(): TemplateResult {
        return html`
            <style>
                :host{
                    display: inline-block;
                    cursor: pointer;
                }</style>
            <slot></slot>
        `;
    }

    _updateClass(l: Location) {
        let active = l.pathname === this.href;
        if (!active) active = l.pathname === `${this.href}/`;
        this.classList.toggle('active', active);
    }
}
