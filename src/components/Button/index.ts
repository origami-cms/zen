import {PolymerElement} from '@polymer/polymer';
import '@polymer/polymer/lib/elements/dom-if.js';
import {component, property, observe, computed} from 'polymer3-decorators';
import {view} from 'util/decorators';
import CSS from './button.scss';
import HTML from './button.template.html';
import Icon from '../Icon';

@component('zen-button')
@view(HTML, CSS.toString())
export default class Button extends PolymerElement {
    @property({reflectToAttribute: true})
    size?: string;

    @property({reflectToAttribute: true})
    icon: string | false = false;

    @property({reflectToAttribute: true})
    'iconright': boolean = false;

    @property({reflectToAttribute: true})
    hollow: boolean = false;

    @property({reflectToAttribute: true})
    color?: string;

    @property({reflectToAttribute: true})
    disabled?: boolean;

    @property({reflectToAttribute: true})
    loading: boolean = false;

    private get _icon() {
        return this.shadowRoot.querySelector('zen-icon') as Icon;
    }

    @computed
    private _iconColor(icon: string, hollow: boolean, color: string) {
        if (hollow && color) return color;
        else if (hollow && !color) return 'main';
        else return 'white';
    }

    @observe('icon')
    private _iconChanged(newV: string) {
        if (!newV && this.iconright) this.iconright = false;
    }
}
