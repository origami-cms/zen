import Element from '../../../lib/Element';
import HTML from './slider.html';
import CSS from './slider.scss';

export default class Slider extends Element {
    min: number = 0;
    max: number = 100;
    value?: number;
    steps?: number;
    label?: string;

    private _handle?: HTMLElement;


    static boundProps = ['min', 'max', 'value', 'label'];


    constructor() {
        super(HTML, CSS, 'slider');

        this._handleDragStart = this._handleDragStart.bind(this);
        this._handleDrag = this._handleDrag.bind(this);
        this._handleDragEnd = this._handleDragEnd.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        this._handle = this._root.querySelector('.handle') as HTMLElement;
        this._handle.addEventListener('dragstart', this._handleDragStart);
        this._handle.addEventListener('drag', this._handleDrag);
        this._handle.addEventListener('dragend', this._handleDragEnd);
    }

    propertyChangedCallback(prop: keyof Slider, oldV: any, newV: any) {
        switch (prop) {
            case 'value':
                if (newV !== oldV) {
                    // TODO: Confine boundaries
                    // if (newV < this.min) return this.value = this.min;
                    // if (newV > this.max) return this.value = this.max;
                    this.trigger('change');
                }
                this._updateHandle();
                break;

            case 'min':
                if (!this.value || this.value < newV) {
                    this.value = newV;
                }
        }
    }

    get width() {
        const t = this as HTMLElement;
        return parseInt((window.getComputedStyle(t)).width as string, 10);
    }
    get screenX() {
        return this.getBoundingClientRect().left;
    }

    get handleWidth() {
        if (!this._handle) return;

        const t = this._handle as HTMLElement;
        return parseInt((window.getComputedStyle(t)).width as string, 10);
    }


    private _handleDragStart(e: DragEvent) {
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        e.dataTransfer.setDragImage(img, 0, 0);

        (this._handle as HTMLElement).classList.add('drag');
    }

    private _handleDrag(e: DragEvent) {
        if (e.screenX === 0) return;


        const dx = e.screenX - this.screenX;

        let l = dx / this.width;
        if (l < 0) l = 0;
        if (l > 1) l = 1;

        if (this.steps) {
            const stepWidth = 1 / (this.steps - 1);
            l = Math.floor(l / stepWidth) * stepWidth;
        }

        this.value = l * (this.max - this.min) + this.min;
    }

    private _handleDragEnd(e: DragEvent) {
        (this._handle as HTMLElement).classList.remove('drag');
    }


    private _updateHandle() {
        if (!this._handle || this.value === undefined) return;
        const perc = `${(this.value - this.min) / (this.max - this.min) * 100}%`;

        this._handle.style.left = perc;
        this._handle.style.transform = `translateX(-${perc})`;
    }
}

window.customElements.define('zen-ui-slider', Slider);
