import { html, LitElement } from '@polymer/lit-element';
import {repeat} from 'lit-html/lib/repeat';
import { component, property } from 'polymer3-decorators/dist';
import { ButtonProps } from '../Button/Button';
import CSS from './button-group-css';
import { TemplateResult } from 'lit-html';

export interface ButtonOptions extends ButtonProps {
    text?: string;
    onclick?: Function;
}

export interface props {
    buttons: ButtonOptions[];
}

@component('zen-button-group')
export default class Button extends LitElement implements props {
    @property
    buttons: ButtonOptions[] = [];

    _render({buttons}: props): TemplateResult {
        return html`
            ${CSS}
            ${repeat(buttons, () => {}, b => html`
                <zen-button
                    size=${b.size}
                    icon=${b.icon}
                    iconright=${b.iconright}
                    hollow=${b.hollow}
                    color=${b.color}
                    disabled=${b.disabled}
                    loading=${b.loading}
                    on-click=${b.onclick}
                >${b.text}</zen-button>
            `)}
        `;
    }
}
