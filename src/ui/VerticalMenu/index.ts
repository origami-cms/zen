import Element from '../../lib/Element';
import HTML from './vertical-menu.html';
import CSS from './vertical-menu.scss';
import Icon from '../Icon';

export interface MenuItem {
    icon: string;
    color: string;
    content: string;
    action: Function;
}

export default class VerticalMenu extends Element {
    items: MenuItem[] = [];


    static boundProps = ['items'];

    constructor() {
        super(HTML, CSS.toString(), 'vertical-menu');
    }


    propertyChangedCallback(prop: keyof VerticalMenu, oldV: any, newV: any) {
        switch (prop) {
            case 'items':
                this._renderItems();
                break;
        }
    }


    private _renderItems() {
        Array.from(this.querySelectorAll('.item')).forEach(e => e.remove());
        this.items.forEach(i => {
            const item = this._renderTemplate('item', i).firstElementChild as Element;
            const icon = (item.querySelector('zen-ui-icon') as Icon);
            icon.type = i.icon;
            icon.color = i.color;
            item.style.color = `var(--color-${i.color})`;
            item.addEventListener('mousedown', e => i.action(e));
            this._root.appendChild(item);
        });
    }
}

window.customElements.define('zen-ui-vertical-menu', VerticalMenu);
