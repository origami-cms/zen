import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { component, property } from '@origami/zen-lib/lib/decorators';
import { ButtonProps } from '@origami/zen-button';
import CSS from './button-group-css';


export interface ButtonOptions extends ButtonProps {
    text?: string;
    onclick?: Function;
}

export interface ButtonGroupProps {
    buttons: ButtonOptions[];
}

@component('zen-button-group')
export class ButtonGroup extends LitElement implements ButtonGroupProps {
    @property
    buttons: ButtonOptions[] = [];

    @property
    size: string = 'main';

    render(): TemplateResult {
        return html`
            ${CSS}
            ${repeat(this.buttons, () => {}, b => html`
                <zen-button
                    .size=${b.size || this.size}
                    .icon=${b.icon}
                    .iconright=${b.iconright}
                    .hollow=${b.hollow}
                    .color=${b.color}
                    .disabled=${b.disabled}
                    .loading=${b.loading}
                    @click=${b.onclick}
                >${b.text}</zen-button>
            `)}
        `;
    }
}
