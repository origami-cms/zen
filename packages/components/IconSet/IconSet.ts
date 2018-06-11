import icons from 'origami-icons';

export default class IconSheet extends HTMLElement {
    connectedCallback() {
        this.style.display = 'none';
        this.innerHTML = icons;
    }
}
window.customElements.define('zen-icon-set', IconSheet);
