import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { component, property } from '@origamijs/zen-lib/lib/decorators';
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


    render() {
        return html`${CSS}<span></span>`;
    }
}
