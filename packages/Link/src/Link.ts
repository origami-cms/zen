import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
// @ts-ignore
import { installRouter } from 'pwa-helpers/router';
import { component, property } from '@origami/zen-lib/lib/decorators';


export interface LinkProps {
    href?: string;
}

@component('zen-link')
// @bindAttributes
export class Link extends LitElement implements LinkProps {
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

    firstUpdated() {
        installRouter(this._updateClass.bind(this));
    }

    render(): TemplateResult {
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
