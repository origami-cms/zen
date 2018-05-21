import Element from '../../lib/Element';
import HTML from './button-group.html';
import CSS from './button-group.scss';


export default class ZenButtonGroup extends Element {
    align?: 'right' | 'left';
    buttons: object[] = [];

    static observeredAttributes = ['align'];
    static boundProps = ['buttons', 'align'];

    private _group?: HTMLElement;


    constructor() {
        super(HTML, CSS.toString());
    }


    render() {
        super.render();
        this._group = this._root.querySelector('.button-group') as HTMLElement;
        this._updateButtons();
    }

    attributeChangedCallback(attr: keyof ZenButtonGroup, oldV: any, newV: any) {
        switch (attr) {
            case 'align':
                this[attr] = newV;
                break;
        }
    }

    propertyChangedCallback(prop: keyof ZenButtonGroup, oldV: any, newV: any) {
        switch (prop) {
            case 'align':
                if (newV) {
                    if (this.getAttribute('align') !== newV) this.setAttribute('align', newV);
                }
                if (this.getAttribute('align') && !newV) this.setAttribute('align', '');
                break;
        }
    }

    private async _updateButtons() {
        await this.ready();
        const g = this._group as HTMLElement;

        this.buttons.forEach((btn, i) => {
            let ele = g.children[i];
            let add = false;
            if (!ele) {
                add = true;
                ele = document.createElement('zen-ui-button');
            }

            Object.assign(ele, btn);
            if (add) g.appendChild(ele);
        });


        // Remove buttons over the supplied button length (old ones)
        Array.from(g.children)
            .slice(this.buttons.length)
            .forEach(e => e.remove());
    }
}


window.customElements.define('zen-ui-button-group', ZenButtonGroup);
