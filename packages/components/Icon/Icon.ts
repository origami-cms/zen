import { LitElement } from '@polymer/lit-element';
import { html, TemplateResult } from 'lit-html';
import { bindAttributes, component, property } from '../../util/decorators';
import CSS from './icon-css';

export interface props {
    type?: string;
    color?: string;
    size?: string;
}
@component('zen-icon')
@bindAttributes
export default class Icon extends LitElement implements props {
    @property
    type?: string;

    @property
    color?: string = 'main';

    @property
    size?: string = 'main';

    static _boundAttributes = ['type', 'color', 'size'];

    _render({color}: { [key in keyof Icon]: any }): TemplateResult {
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
