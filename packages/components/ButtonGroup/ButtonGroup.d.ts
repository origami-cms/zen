import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { ButtonProps } from '../Button/Button';
export interface ButtonOptions extends ButtonProps {
    text?: string;
    onclick?: Function;
}
export interface props {
    buttons: ButtonOptions[];
}
export default class Button extends LitElement implements props {
    buttons: ButtonOptions[];
    _render({buttons}: props): TemplateResult;
}
