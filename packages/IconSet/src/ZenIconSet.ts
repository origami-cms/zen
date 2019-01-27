import icons from 'origami-icons';

export class ZenIconSet extends HTMLElement {
  public connectedCallback() {
    this.style.display = 'none';
    // tslint:disable no-inner-html
    this.innerHTML = icons;
  }
}
window.customElements.define('zen-icon-set', ZenIconSet);


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-icon-set': ZenIconSet;
  }
}
