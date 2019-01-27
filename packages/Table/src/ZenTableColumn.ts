import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';
import { TableRowData } from './ZenTable';

export type TableColumnAlign = 'center' | 'left' | 'right';

export interface TableColumnProps {
  key?: string;
  heading?: string;
  footer?: string;
  sortable: boolean;
  align?: TableColumnAlign;
  icon?: string;
  colwidth?: string;
}

export type TableColumnTemplate = ((data: TableRowData) => string | TemplateResult) | string | null;

// @ts-ignore
@customElement('zen-table-column')
export class ZenTableColumn extends LitElement implements TableColumnProps {
  @property()
  public key?: string;

  @property()
  public heading?: string;

  @property()
  public footer?: string;

  @property({ reflect: true, type: Boolean })
  public sortable: boolean = false;

  @property()
  public align?: TableColumnAlign;

  @property()
  public icon?: string;

  @property()
  public colwidth?: string;

  @property()
  public template: TableColumnTemplate = null;

  public render() {
    return html``;
  }

  public getTemplate(): TableColumnTemplate {
    if (this.template) return this.template;
    const template = this.querySelector('template');

    if (!template) return null;
    return template.innerHTML;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-table-column': ZenTableColumn;
  }
}
