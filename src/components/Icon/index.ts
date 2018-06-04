import {LitElement} from '@polymer/lit-element';
import {html, svg} from 'lit-html';
import {component, property} from 'polymer3-decorators';
import {style, bindAttributes} from 'util/decorators';
import CSS from './icon-css';

@component('zen-icon')
@bindAttributes
export default class Icon extends LitElement {
    @property
    type?: string;

    @property
    color?: string = 'main';

    @property
    size?: string = 'main';

    static _boundAttributes = ['type', 'color', 'size'];

    // tslint:disable-next-line function-name
    _render({color, type}: { [key in keyof Icon]: any }) {
        const children = this._symbol || [];
        return html`
            ${CSS}
            <svg
                viewBox="0 0 40 40"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                style="pointer-events: none; display: block; width: 100%; height: 100%;" class="${color}"
            >${children.map(c => svg`${c}`)}</svg>
        `;
    }

    private get _symbol() {
        if (!this.type) return;
        let newIcon = document.querySelector(`#zen-icon-${this.type}`);

        if (!newIcon) return console.error(`Icon ${this.type} not found`);
        newIcon = newIcon.cloneNode(true) as SVGSymbolElement;

        return Array.from(newIcon.children);
    }
}
