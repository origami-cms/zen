import icons from 'origami-icons';

export class IconSet extends HTMLElement {
    connectedCallback() {
        this.style.display = 'none';
        // @ts-ignore
        this.innerHTML = icons;
    }
}
window.customElements.define('zen-icon-set', IconSet);
