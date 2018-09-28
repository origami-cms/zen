import { html, LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { component, property } from '@origamijs/zen-lib/lib/decorators';
import { ButtonProps } from '@origamijs/zen-button';
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

    render(): TemplateResult {
        const { buttons } = this;

        return html`
            ${CSS}
            ${repeat(buttons, () => {}, b => html`
                <zen-button
                    .size=${b.size}
                    .icon=${b.icon}
                    .iconright=${b.iconright}
                    .hollow=${b.hollow}
                   .color=${b.color}
                    ?disabled=${b.disabled}
                    ?loading=${b.loading}
                    @click=${b.onclick}
                >${b.text}</zen-button>
            `)}
        `;
    }
}
