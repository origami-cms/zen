import { LitElement } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export interface ButtonProps {
    size?: string;
    icon?: string | boolean;
    iconright?: boolean;
    hollow?: boolean;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
}
/**
 * @class Button
 * The button element is a styled button with options of
 * adding an icon, loading state, and size.
 */
export default class Button extends LitElement implements ButtonProps {
    size?: string;
    icon?: string | boolean;
    iconright?: boolean;
    hollow?: boolean;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
    private static _boundAttributes;
    private readonly _icon;
    _render({icon, size, loading}: ButtonProps): TemplateResult;
    private readonly _iconColor;
}
