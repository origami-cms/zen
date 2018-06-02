import { PolymerElement } from '@polymer/polymer';
import { component, property, observe, computed } from 'polymer3-decorators';
import CSS from './tooltip.scss';
import {view} from 'util/decorators';


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


@component('zen-tooltip')
@view('<slot></slot>', CSS.toString())
export default class Tooltip extends PolymerElement {

    @property({reflectToAttribute: true})
    position?: TooltipPosition = 'bottom';

    @property({reflectToAttribute: true})
    for: HTMLElement | null = null;

    @property({reflectToAttribute: true})
    removeable?: boolean;


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
        if (this.removeable) {
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


    @observe('for')
    @observe('position')
    private _update() {
        if (!this.target || !this.position) {
            this.hide();
            return;
        } else this.hide(false);


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
