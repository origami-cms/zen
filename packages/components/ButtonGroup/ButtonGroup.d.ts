import { LitElement } from '@polymer/lit-element';
import { ButtonProps } from '../Button/Button';
import { TemplateResult } from 'lit-html';
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
