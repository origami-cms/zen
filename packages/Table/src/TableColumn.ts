import { customElement, html, LitElement, property } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';

export type TableColumnAlign = 'center' | 'left' | 'right';

export interface TableColumnProps {
    key?: string;
    heading?: string;
    footer?: string;
    sortable?: string;
    align?: TableColumnAlign;
    icon?: string;
}

// @ts-ignore
@customElement('zen-table-column')
export class TableColumn extends LitElement implements TableColumnProps {

    @property()
    key?: string;

    @property()
    heading?: string;

    @property()
    footer?: string;

    @property()
    sortable?: string;

    @property()
    align?: TableColumnAlign;

    @property()
    icon?: string;


    render(): TemplateResult {
        return html``;
    }

    getTemplate() {
        const template = this.querySelector('template');
        if (!template) return;
        return template.content.textContent || '';
    }
}
