import icons from 'svg-inline-loader!icons';


window.customElements.define('zen-icon-set', class IconSheet extends HTMLElement {
    connectedCallback() {
        this.innerHTML = icons;
    }
});
