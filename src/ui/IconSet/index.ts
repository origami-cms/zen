import icons from 'svg-inline-loader!icons';


export default class IconSheet extends HTMLElement {
    connectedCallback() {
        this.innerHTML = icons;
    }
}
window.customElements.define('zen-ui-icon-set', IconSheet);
