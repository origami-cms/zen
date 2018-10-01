import { Checkbox } from '@origamijs/zen-checkbox';
import { customElement, html, LitElement, property } from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import CSS from './table-css';
import { TableColumn, TableColumnAlign } from './TableColumn';
export { TableColumn } from './TableColumn';

export interface TableProps {
    data: object[];
    selectable: boolean;
    selected: number[];
    hoverable: boolean;
    striped: boolean;
}


export interface TableRowData {
    [key: string]: any;
}


export interface TableColumnData {
    index: number;
    key?: string;
    heading?: string;
    footer?: string;
    sortable?: string;
    template?: string;
    icon?: string;
    align?: TableColumnAlign;
}


// @ts-ignore
@customElement('zen-table')
export class Table extends LitElement implements TableProps {
    @property()
    data: object[] = [];

    @property({reflect: true, type: Boolean})
    selectable: boolean = false;

    @property()
    selected: number[] = [];

    @property({reflect: true, type: Boolean})
    hoverable: boolean = false;

    @property({reflect: true, type: Boolean})
    striped: boolean = false;


    render(): TemplateResult {
        const columns = this._getColumns();
        const hasHeading = Boolean(columns.find(c => Boolean(c.heading)));

        return html`
            ${CSS}
            <div class="table" style="--table-cols: ${columns.length}">
                ${hasHeading
                    ? this._renderHeader(columns)
                    : null
                }
                ${this.data.map((row, i) => this._renderRow(row, columns, i))}
            </div>
        `;
    }


    // Convert zen-table-column children to column objects
    private _getColumns(): TableColumnData[] {
        return (Array.from(this.querySelectorAll('zen-table-column')) as TableColumn[])
            .map((c, index) => ({
                index,
                key: c.key,
                heading: c.heading,
                footer: c.footer,
                sortable: c.sortable,
                align: c.align,
                icon: c.icon,
                template: c.getTemplate()
            }));
    }


    // Render the TH cells for each column
    private _renderHeader(columns: TableColumnData[]): TemplateResult[] {
        const cols = columns.map(col => this._renderTH(col, columns));

        this._addCheckbox(cols, 'th', 'all');

        return cols;
    }


    // Render the TD cells for each column
    private _renderRow(row: TableRowData, columns: TableColumnData[], index: number) {
        const cols = columns.map((col, i) =>
            this._renderTD(row, index, col, columns)
        );
        this._addCheckbox(cols, 'td', index);

        return cols;
    }


    // Render TH cell
    private _renderTH(col: TableColumnData, columns: TableColumnData[]) {
        const classes = this._getCellClasses(col, columns);
        return html`<div class="th ${classes}">
            ${col.icon
                ? html`<zen-icon type=${col.icon} size="small"></zen-icon>`
                : null
            }
            ${col.heading}
        </div>`;
    }


    // Render TD cell
    private _renderTD(
        row: TableRowData,
        index: number,
        column: TableColumnData,
        columns: TableColumnData[]
    ): TemplateResult | null {

        let contents;
        // Replace the template string {{var}}'s with values from this.data
        if (column.template) {
            contents = unsafeHTML(
                column.template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, val) => row[val])
            );

        } else if (column.key) {
            contents = row[column.key];

        } else return null;


        const classes = this._getCellClasses(column, columns, index);
        return html`<div class="td ${classes}">${contents}</div>`;
    }


    // Generate the classes for a TH or TD
    private _getCellClasses(column: TableColumnData, columns: TableColumnData[], index?: number) {
        const classes = [];

        if (column.index % columns.length === 0) classes.push('first');
        if ((column.index + 1) % columns.length === 0) classes.push('last');
        if (column.align) classes.push(column.align);
        if (this.striped && index !== undefined && index % 2 === 1) classes.push('stripe');

        return classes.join(' ');
    }


    // Inject the checkbox cell if this.selectable
    private _addCheckbox(
        row: (TemplateResult | null)[],
        type: 'th' | 'td',
        select: number | 'all'
    ): (TemplateResult | null)[] {

        const handler = (e: Event) => this.select(select, (e.target as Checkbox).checked!);

        if (this.selectable) {
            let stripe = false;
            if (this.striped && typeof select === 'number' && select % 2 === 1) stripe = true;
            let checked = false;

            if (typeof select === 'number') checked = this.selected.includes(select);

            row.unshift(html`<div class="${type} checkbox ${stripe ? 'stripe' : ''}">
                <zen-checkbox
                    .checked=${checked}
                    @change=${handler.bind(this)}
                    size="small"
                ></zen-checkbox>
            </div>`);
        }

        return row;
    }


    // (Dis)select all, none or a single row
    select(row: number | 'all', select: boolean) {
        if (row === 'all') {
            // Select all items or none
            this.selected = select ? [...Array(this.data.length).keys()] : [];
        } else {
            // Append a new row if it's not already selected
            if (select && !this.selected.includes(row)) {
                this.selected.push(row);

            // Remove row if it exists
            } else if (!select && this.selected.includes(row)) {
                this.selected.splice(this.selected.indexOf(row), 1);
            }
        }
    }
}
