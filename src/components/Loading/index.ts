import {LitElement} from '@polymer/lit-element';
import {html} from 'lit-html';
import {component, property} from 'polymer3-decorators';
import {style} from 'util/decorators';
import CSS from './loading-css';

@component('zen-loading')
export default class Loading extends LitElement {
    @property
    color?: string;

    @property
    size?: string;

    static _boundAttributes = ['color', 'size'];

    // tslint:disable-next-line function-name
    _render() {
        return html`${CSS}<span></span>`;
    }
}
