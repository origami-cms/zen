import {PolymerElement} from '@polymer/polymer';
import {component, property, observe, computed} from 'polymer3-decorators';
import {view} from 'util/decorators';

import CSS from './icon.scss';
import HTML from './icon.template.html';

@component('zen-icon')
@view(HTML, CSS.toString())
export default class Icon extends PolymerElement {
    @property({reflectToAttribute: true})
    type?: string;

    @property({reflectToAttribute: true})
    color?: string = 'main';

    @property({reflectToAttribute: true})
    size?: string = 'main';

    ready() {
        super.ready();
    }

    private get _svg() {
        return (this.shadowRoot as ShadowRoot).querySelector('svg') as SVGElement;
    }

    @observe('type')
    private async _typeChanged(newV: string, oldV: string) {
        if (!newV) return;
        let newIcon = document.querySelector(`#zen-icon-${newV}`);
        await this.ready();

        if (!newIcon) {
            this.type = oldV;
            throw new Error(`Icon ${newV} not found`);
        } else newIcon = newIcon.cloneNode(true) as SVGSymbolElement;


        this._svg.innerHTML = '';
        Array.from(newIcon.children).forEach(c => {
            c.classList.add('zen-icon');
            this._svg.appendChild(c);
        });
    }
}
