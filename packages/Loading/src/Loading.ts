import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { component, property } from '@origamijs/zen-lib/lib/decorators';
import CSS from './loading-css';


export interface LoadingProps {
    color?: string;
    size?: string;
}

@component('zen-loading')
export class Loading extends LitElement implements LoadingProps {
    @property
    color?: string;

    @property
    size?: string;

    static _boundAttributes = ['color', 'size'];


    render() {
        return html`${CSS}<span></span>`;
    }
}
