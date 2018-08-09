import {LitElement} from '@polymer/lit-element';
import {html, TemplateResult} from 'lit-html';

import {component, property, bindAttributes, dispatchChange} from '../../util/decorators';
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
    show: boolean;
    __show: boolean;
    for: HTMLElement | null;
    _for?: HTMLElement | string;
    on?: boolean | 'hover';
    _on?: boolean | 'hover';
}

@component('zen-tooltip')
@bindAttributes
export default class Tooltip extends LitElement implements props {
    @property
    position?: TooltipPosition = 'bottom';

    private static _boundAttributes = ['position', 'on'];

    constructor() {
        super();
        this._update = this._update.bind(this);
        this._remove = this._remove.bind(this);
        this._show = this._show.bind(this);
        this._hide = this._hide.bind(this);
    }

    ready() {
        super.ready();
        this.show = false;
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

    @property
    get show() {
        return this.__show;
    }
    set show(v) {
        if (v) this.setAttribute('show', 'true');
        else this.removeAttribute('show');

        this.__show = v;
    }
    __show: boolean = false;


    @property
    get for(): HTMLElement | null {
        if (typeof this._for === 'string') return document.querySelector(`#${this._for}`);
        else return this._for || null;
    }
    set for(v) {

        if (v && this._for !== v) {
            this._updateHandlers('remove');
            this._for = v;
            this._updateHandlers('add');
            this._update();
        }
    }
    _for?: string | HTMLElement;


    @property
    get on() {
        return this._on;
    }
    set on(v) {
        this._updateHandlers('remove');
        this._on = v;
        this._updateHandlers('add');
    }
    _on?: boolean | 'hover';


    _render(): TemplateResult {
        return html`${CSS}<slot></slot>`;
    }


    _didRender() {
        this._update();
    }


    private _show() { this.show = true; }
    private _hide() { this.show = false; }


    private _update() {
        if (!this.for || !this.position) {
            this.show = false;
            return;
        }

        const {x, y, width, height} = this.for.getBoundingClientRect() as DOMRect;

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


    private _updateHandlers(type: 'add' | 'remove') {
        const f = this.for;
        if (!f || typeof this.on === 'boolean') return;

        const fun = type === 'add' ? f.addEventListener.bind(f) : f.removeEventListener.bind(f);

        switch (this.on) {
            case 'hover':
                fun('mouseenter', this._show);
                fun('mouseleave', this._hide);
                break;
        }
    }
}
