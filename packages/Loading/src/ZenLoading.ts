import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import CSS from './loading-css';

export interface LoadingProps {
  color?: string;
  size?: string;
}

@customElement('zen-loading')
export class ZenLoading extends LitElement implements LoadingProps {
  public static _boundAttributes = ['color', 'size'];

  @property()
  public color?: string;

  @property()
  public size?: string;

  public render() {
    return html`
      ${CSS}<span></span>
    `;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-loading': ZenLoading;
  }
}
