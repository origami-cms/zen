import icons from 'svg-inline-loader!icons';


export default class IconSheet extends HTMLElement {
    connectedCallback() {
        this.innerHTML = icons;
    }
}
window.customElements.define('zen-icon-set', IconSheet);
