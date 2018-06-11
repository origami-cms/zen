import {LitElement} from '@polymer/lit-element';
import {html, TemplateResult} from 'lit-html';
import {component, property} from 'polymer3-decorators';
import {bindAttributes} from '../../util/decorators';
import CSS from './tooltip-css';

export type TooltipPosition =
    'top-left' |
    'top' |
    'top-right' |
    'right-top' |
    'right' |
    'right-bottom' |
    'bottom-right' |
    'bottom' |
    'bottom-left' |
    'top-right' |
    'left-bottom' |
    'left' |
    'left-top';

export interface props {
    position?: TooltipPosition;
    for: HTMLElement | null;
}

@component('zen-tooltip')
@bindAttributes
export default class Tooltip extends LitElement implements props {

    @property
    position?: TooltipPosition = 'bottom';

    @property
    for: HTMLElement | null = null;

    static _boundAttributes = ['position', 'for'];

    constructor() {
        super();
        this._update = this._update.bind(this);
        this._remove = this._remove.bind(this);
    }

    ready() {
        super.ready();
        if (!this.for) this.hide();
    }

    connectedCallback() {
        super.connectedCallback();
        this._update();
        if (this.removable) {
            window.addEventListener('mouseup', this._remove);
            window.addEventListener('keydown', this._remove);
        }
        window.addEventListener('scroll', this._update);
        window.addEventListener('resize', this._update);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('scroll', this._update);
        window.removeEventListener('resize', this._update);
    }

    get target() {
        return document.querySelector(`#${this.for}`);
    }

    hide(show = true) {
        this.style.display = Boolean(show) ? 'none' : '';
    }


    _render(): TemplateResult {
        return html`${CSS}<slot></slot>`;
    }


    _didRender() {
        this._update();
    }

    private _update() {
        if (!this.target || !this.position) {
            this.hide();
            return;
        } this.hide(false);

        const {x, y, width, height} = this.target.getBoundingClientRect() as DOMRect;

        if (/^left$/.test(this.position)) {
            this.style.left = `${parseInt(x.toString(), 10)}px`;
        } else if (/^right$/.test(this.position)) {
            this.style.left = `${parseInt((x + width).toString(), 10)}px`;
        } else {
            this.style.left = `${parseInt((x + width / 2).toString(), 10)}px`;
        }

        if (/^top$/.test(this.position)) {
            this.style.top = `${parseInt(y.toString(), 10)}px`;
        } else if (/^bottom$/.test(this.position)) {
            this.style.top = `${parseInt((y + height).toString(), 10)}px`;
        } else {
            this.style.top = `${parseInt((y + height / 2).toString(), 10)}px`;
        }
    }

    private _remove(e: KeyboardEvent | MouseEvent) {
        if (e instanceof KeyboardEvent) {
            if (e.key !== 'Escape') return;
        }

        window.removeEventListener('keydown', this._remove);
        window.removeEventListener('click', this._remove);
        this.remove();
    }
}
