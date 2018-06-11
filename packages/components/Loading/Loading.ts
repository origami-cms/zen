import {LitElement} from '@polymer/lit-element';
import {html, TemplateResult} from 'lit-html';
import {component, property} from 'polymer3-decorators';
import {style} from '../../util/decorators';
import CSS from './loading-css';

export interface props {
    color?: string;
    size?: string;
}

@component('zen-loading')
export default class Loading extends LitElement implements props {
    @property
    color?: string;

    @property
    size?: string;

    static _boundAttributes = ['color', 'size'];


    _render(): TemplateResult {
        return html`${CSS}<span></span>`;
    }
}
