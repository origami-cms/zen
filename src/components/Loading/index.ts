import {PolymerElement} from '@polymer/polymer';
import {component, property, computed} from 'polymer3-decorators';
import {view} from 'util/decorators';

import CSS from './loading.scss';

@component('zen-loading')
@view('<span></span>', CSS.toString())
export default class Loading extends PolymerElement {
    @property({reflectToAttribute: true})
    color?: string;

    @property({reflectToAttribute: true})
    size?: string;
}
