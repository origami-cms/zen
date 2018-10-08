import { Checkbox } from '@origamijs/zen-checkbox';
import { customElement, html, LitElement, property } from '@polymer/lit-element';
import query from 'json-query';
import { TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import CSS from './table-css';
import { TableColumn, TableColumnAlign } from './TableColumn';
export { TableColumn } from './TableColumn';


export const TABLE_EVENTS = {
    tdClick: 'rowclick',
    select: 'select'
};

export interface TableProps {
    data: TableRowData[];
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
    sortable: boolean;
    template?: string;
    icon?: string;
    align?: TableColumnAlign;
    width?: string;
}

export interface TableRowData {
    index: number;
    data: TableRowData;
    cells: (string | null | number)[];
}

const SORT_NORMAL = 'normal';
const SORT_REVERSE = 'reverse';
export type SortDirection = 'normal' | 'reverse';


// @ts-ignore
@customElement('zen-table')
export class Table extends LitElement implements TableProps {
    @property()
    data: TableRowData[] = [];

    @property({reflect: true, type: Boolean})
    selectable: boolean = false;

    @property()
    selected: number[] = [];

    @property({reflect: true, type: Boolean})
    hoverable: boolean = false;

    @property({ reflect: true, type: Boolean })
    striped: boolean = false;

    /** Index of the column to sort by  */
    @property({type: Number})
    sortBy: number | false = false;

    @property({type: String})
    sortDirection: SortDirection = 'normal';


    render(): TemplateResult {
        const columns = this._getColumns();
        const hasHeading = Boolean(columns.find(c => Boolean(c.heading)));
        const columnTemplate = this._getColumnTemplate(columns);

        return html`
            ${CSS}
            <div class="table" style="--table-cols: ${columns.length}; ${columnTemplate}">
                ${hasHeading
                    ? this._renderHeader(columns)
                    : null
                }
                ${this._getData(columns).map(row => this._renderRow(row, columns))}
            </div>
        `;
    }


    // updated(p: any) {
    //     if (p.has('selected')) {
    //         this.dispatchEvent(new CustomEvent('select', {detail: this.selected}));
    //     }
    // }


    // Convert zen-table-column children to column objects
    private _getColumns(): TableColumnData[] {
        // Look for direct children...
        let cols = Array.from(this.querySelectorAll('zen-table-column'));
        const slot = this.querySelector('slot');
        // Look for slotted children...
        if (!cols.length && slot) {
            // @ts-ignore assignedElements DOES exist
            cols = slot.assignedNodes().filter(e => e.nodeName === 'ZEN-TABLE-COLUMN');
        }

        return (cols as TableColumn[]).map((c, index) => ({
            index,
            key: c.key,
            heading: c.heading || c.key,
            footer: c.footer,
            sortable: c.sortable,
            align: c.align,
            icon: c.icon,
            width: c.width,
            template: c.getTemplate()
        }));
    }


    private _getColumnTemplate(columns: TableColumnData[]) {
        const widths = columns.map(c => c.width || 'auto');
        if (this.selectable) widths.unshift('var(--table-row-height)');
        return `grid-template-columns: ${widths.join(' ')}`;
    }


    private _getData(columns: TableColumnData[]): TableRowData[] {
        let data = this.data.map((data, index) => ({
            data,
            index,
            cells: columns.map(c => this._getTDContents(data, c))
        }));

        if (this.sortBy !== false) {
            const sort = this.sortBy;
            data = data.sort((a, b) => {
                const contentA = a.cells[sort] || '';
                const contentB = b.cells[sort] || '';

                if (typeof contentA === 'string') return contentA.localeCompare(contentB);
                else if (typeof contentA === 'number') {
                    if (contentA < contentB) return -1;
                    if (contentA > contentB) return 1;
                    if (contentA === contentB) return 0;
                }
                return 0;
            });
        }
        if (this.sortDirection === SORT_REVERSE) data.reverse();
        return data;
    }


    private _getTDContents(row: TableRowData, column: TableColumnData): string | null {
        let contents;
        const lookup = (q: string) => query(q, {data: row}).value;

        // Replace the template string {{var}}'s with values from this.data
        if (column.template) {
            contents = column.template.replace(/\{\{\s*([^\{]+)\s*\}\}/g, (match, val) =>
                query(val, {data: row}).value
            );


        } else if (column.key) {
            contents = lookup(column.key);

        } else return null;

        return contents;
    }


    // Render the TH cells for each column
    private _renderHeader(columns: TableColumnData[]): TemplateResult[] {
        const cols = columns.map(col => this._renderTH(col, columns));

        this._addCheckbox(cols, 'th', 'all');

        return cols;
    }


    // Render the TD cells for each column
    private _renderRow(row: TableRowData, columns: TableColumnData[]) {
        const cols = columns.map(col =>
            this._renderTD(row, col, columns)
        );
        this._addCheckbox(cols, 'td', row.index);

        return cols;
    }


    // Render TH cell
    private _renderTH(col: TableColumnData, columns: TableColumnData[]) {
        let classes = this._getCellClasses(col, columns);

        const icon = col.icon
            ? html`<zen-icon type=${col.icon} size="medium"></zen-icon>`
            : null;

        let sort;
        if (col.sortable) {
            let sortIcon = 'sort';
            let sortIconColor = 'grey-300';
            if (this.sortBy === col.index) {
                sortIcon = this.sortDirection === SORT_NORMAL ? 'sort-normal' : 'sort-reverse';
                sortIconColor = 'alt';
            }

            sort = html`<zen-icon type="${sortIcon}" color=${sortIconColor} size="medium"></zen-icon>`;
            classes += ' sortable';
        }

        return html`<div class="th ${classes}" @click=${() => this._handleTHClick(col)}>
            ${icon}
            <span>${col.heading}</span>
            ${sort}
        </div>`;
    }


    // Render TD cell
    private _renderTD(
        row: TableRowData,
        column: TableColumnData,
        columns: TableColumnData[]
    ): TemplateResult | null {

        const classes = this._getCellClasses(column, columns, row.index);
        return html`<div class="td ${classes}" @click=${() => this._handleTDClick(row)}>
            <div>${unsafeHTML(row.cells[column.index])}</div>
        </div>`;

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
        this.dispatchEvent(new CustomEvent(TABLE_EVENTS.select, {detail: this.selected}));
    }


    private _handleTHClick(col: TableColumnData) {
        if (!col.sortable) return;

        // If the same column is clicked, flip the sort
        if (this.sortBy === col.index) {
            if (this.sortDirection === SORT_NORMAL) {
                this.sortDirection = SORT_REVERSE;
            } else if (this.sortDirection === SORT_REVERSE) {
                this.sortDirection = SORT_NORMAL;
                this.sortBy = false;
            }

        } else {
            this.sortBy = col.index;
            // Reset the direction
            if (this.sortDirection !== SORT_NORMAL) this.sortDirection = SORT_NORMAL;
        }
    }

    private _handleTDClick(row: TableRowData) {
        this.dispatchEvent(new CustomEvent(TABLE_EVENTS.tdClick, {detail: row.data}));
    }
}
