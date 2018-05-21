import Element from '../../lib/Element';
import HTML from './modal.html';
import CSS from './modal.scss';


export default class Modal extends Element {
    constructor() {
        super(HTML, CSS);
        this.close = this.close.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.parentElement !== document.body) document.body.appendChild(this);

        (this._root.querySelector('zen-ui-icon[type=cross]') as HTMLElement).addEventListener('click', this.close);
        (this._root.querySelector('.overlay') as HTMLElement).addEventListener('click', this.close);
        window.addEventListener('keyup', e => {
            if (e.key === 'Escape') this.close();
        });
    }

    close() {
        this.remove();
    }
}

window.customElements.define('zen-ui-modal', Modal);
