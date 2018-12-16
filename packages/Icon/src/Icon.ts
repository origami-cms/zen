import { bindAttributes, component, property } from '@origami/zen-lib/lib/decorators';
import { html, LitElement } from '@polymer/lit-element';
import CSS from './icon-css';
import { TemplateResult } from 'lit-html';

export interface IconProps {
    type?: string;
    color?: string;
    size?: string;
}
@component('zen-icon')
@bindAttributes
export class Icon extends LitElement implements IconProps {
    @property
    type?: string;

    @property
    color?: string = 'main';

    @property
    size?: string = 'main';

    static _boundAttributes = ['type', 'color', 'size'];

    render(): TemplateResult {
        const { color } = this;

        const children = this._symbol || [];
        return html`
            ${CSS}
            <style>zen-icon {display: none}</style>
            <svg
                viewBox="0 0 40 40"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                style="pointer-events: none; display: block; width: 100%; height: 100%;" class="${color}"
            >${children}</svg>
        `;
    }

    private get _symbol() {
        if (!this.type) return;
        return new Promise(async res => {
            await window.customElements.whenDefined('zen-icon-set');
            let newIcon = document.querySelector(`#zen-icon-${this.type}`);

            if (!newIcon) return console.error(`Icon ${this.type} not found`);
            newIcon = newIcon.cloneNode(true) as SVGSymbolElement;

            res(Array.from(newIcon.children));
        });
    }
}
