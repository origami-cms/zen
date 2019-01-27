import { ZenCheckbox } from '@origami/zen-checkbox';
import query from 'json-query';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import { TemplateResult } from 'lit-html';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import CSS from './table-css';
import { TableColumnAlign, TableColumnTemplate, ZenTableColumn } from './ZenTableColumn';
// tslint:disable-next-line export-name
export { ZenTableColumn as TableColumn } from './ZenTableColumn';

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

export interface TableColumnData {
  index: number;
  key?: string;
  heading?: string;
  footer?: string;
  sortable: boolean;
  template: TableColumnTemplate;
  icon?: string;
  align?: TableColumnAlign;
  width?: string;
}

export interface TableRowData {
  index: number;
  data: TableRowData;
  cells: (string | TemplateResult | null | number)[];
}

const SORT_NORMAL = 'normal';
const SORT_REVERSE = 'reverse';
export type SortDirection = 'normal' | 'reverse';


// @ts-ignore
@customElement('zen-table')
export class ZenTable extends LitElement implements TableProps {
  @property()
  public data: TableRowData[] = [];

  @property({ reflect: true, type: Boolean })
  public selectable: boolean = false;

  @property()
  public selected: number[] = [];

  @property({ reflect: true, type: Boolean })
  public hoverable: boolean = false;

  @property({ reflect: true, type: Boolean })
  public striped: boolean = false;

  /**
   * Index of the column to sort by
   */
  @property({ type: Number })
  public sortBy: number | false = false;

  @property({ type: String })
  public sortDirection: SortDirection = 'normal';


  public render() {
    const columns = this._getColumns();
    const hasHeading = Boolean(columns.find((c) => Boolean(c.heading)));
    const columnTemplate = this._getColumnTemplate(columns);

    return html`
      ${CSS}
      <div
        class="table"
        style="--table-cols: ${columns.length}; ${columnTemplate}"
      >
        ${hasHeading ? this._renderHeader(columns) : null}
        ${this._getData(columns).map((row) => this._renderRow(row, columns))}
      </div>
    `;
  }


  // (Dis)select all, none or a single row
  public select(row: number | 'all', select: boolean) {
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
    this.dispatchEvent(
      new CustomEvent(TABLE_EVENTS.select, { detail: this.selected })
    );
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
      cols = slot
        .assignedNodes()
        .filter((e) => e.nodeName === 'ZEN-TABLE-COLUMN');
    }

    return (cols as ZenTableColumn[]).map((c, index) => ({
      index,
      key: c.key,
      heading: c.heading || c.key,
      footer: c.footer,
      sortable: c.sortable,
      align: c.align,
      icon: c.icon,
      width: c.colwidth,
      template: c.getTemplate()
    }));
  }


  private _getColumnTemplate(columns: TableColumnData[]) {
    const widths = columns.map((c) => c.width || 'auto');
    if (this.selectable) widths.unshift('var(--row-height)');
    return `grid-template-columns: ${widths.join(' ')}`;
  }


  private _getData(columns: TableColumnData[]): TableRowData[] {
    let data = this.data.map((d, index) => ({
      data: d,
      index,
      cells: columns.map((c) => this._getTDContents(d, c))
    }));

    if (this.sortBy !== false) {
      const sort = this.sortBy;
      data = data.sort((a, b) => {
        const contentA = a.cells[sort] || '';
        const contentB = b.cells[sort] || '';

        if (typeof contentA === 'string') {
          return contentA.localeCompare(contentB as string);
        } else if (typeof contentA === 'number') {
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


  /**
   * Render the template/contents of a column for a specific row
   * If column.template is a string, {{var}} variables get replaced with row
   * data.
   * @param row Row data to render
   * @param column Column data from the <zen-table-column>
   */
  private _getTDContents(
    row: TableRowData,
    column: TableColumnData
  ): string | TemplateResult | null {
    const lookup = (q: string) => query(q, { data: row }).value;

    switch (typeof column.template) {
      case 'function':
        return column.template(row);

      case 'string':
        // Replace the template string {{var}}'s with values from this.data
        return column.template.replace(
          /\{\{\s*([^\{]+)\s*\}\}/g,
          (match, val) => query(val, { data: row }).value
        );

      default:
        if (column.key) return lookup(column.key);
        else return null;
    }
  }


  // Render the TH cells for each column
  private _renderHeader(columns: TableColumnData[]): TemplateResult[] {
    const cols = columns.map((col) => this._renderTH(col, columns));

    this._addCheckbox(cols, 'th', 'all');

    return cols;
  }


  // Render the TD cells for each column
  private _renderRow(row: TableRowData, columns: TableColumnData[]) {
    const cols = columns.map((col) => this._renderTD(row, col, columns));
    this._addCheckbox(cols, 'td', row.index);

    return cols;
  }


  // Render TH cell
  private _renderTH(col: TableColumnData, columns: TableColumnData[]) {
    const extraClasses: ClassInfo = {};

    const icon = col.icon
      ? html`
          <zen-icon type="${col.icon}" size="medium"></zen-icon>
        `
      : null;

    let sort;
    if (col.sortable) {
      let sortIcon = 'sort';
      let sortIconColor = 'grey-300';
      if (this.sortBy === col.index) {
        sortIcon =
          this.sortDirection === SORT_NORMAL ? 'sort-normal' : 'sort-reverse';
        sortIconColor = 'alt';
      }

      sort = html`
        <zen-icon
          type="${sortIcon}"
          color="${sortIconColor}"
          size="medium"
        ></zen-icon>
      `;
      extraClasses.sortable = true;
    }
    const classes = this._getCellClasses(
      'th',
      col,
      columns,
      undefined,
      extraClasses
    );

    return html`
      <div class="${classes}" @click="${() => this._handleTHClick(col)}">
        ${icon} <span>${col.heading}</span> ${sort}
      </div>
    `;
  }


  // Render TD cell
  private _renderTD(
    row: TableRowData,
    column: TableColumnData,
    columns: TableColumnData[]
  ): TemplateResult | null {
    const classes = this._getCellClasses('td', column, columns, row.index);

    let td = row.cells[column.index];


    // If cell template is not a TemplateResult, convert it as unsafe html
    if (!(td instanceof Object)) td = html`${unsafeHTML(td)}`;
    else td = html`${td}`;

    return html`
      <div class="${classes}" @click="${() => this._handleTDClick(row)}">
        <div>${td}</div>
      </div>
    `;
  }


  // Generate the classes for a TH or TD
  private _getCellClasses(
    type: 'th' | 'td',
    column: TableColumnData,
    columns: TableColumnData[],
    index?: number,
    extra?: ClassInfo
  ) {
    const last = (column.index + 1) % columns.length === 0;
    const classes: ClassInfo = {
      [type]: true,
      first: column.index % columns.length === 0,
      last,
      checked: Boolean(last && index && this.selected.includes(index)),
      stripe: this.striped && index !== undefined && index % 2 === 1
    };
    if (column.align) classes[column.align] = true;

    return classMap({
      ...classes,
      ...extra
    });
  }


  // Inject the checkbox cell if this.selectable
  private _addCheckbox(
    row: (TemplateResult | null)[],
    type: 'th' | 'td',
    select: number | 'all'
  ): (TemplateResult | null)[] {
    const handler = (e: Event) => {
      const t = e.target as ZenCheckbox;
      let next: Element = t.parentElement!;
      // Toggle the last td with checked class
      while (next && !next.classList.contains('last')) {
        next = next.nextElementSibling!;
      }
      next.classList.toggle('checked', t.checked);
      this.select(select, t.checked!);
    };

    if (this.selectable) {
      let stripe = false;
      if (this.striped && typeof select === 'number' && select % 2 === 1) {
        stripe = true;
      }
      let checked = false;

      if (typeof select === 'number') checked = this.selected.includes(select);

      const classes = classMap({
        [type]: true,
        checkbox: true,
        stripe,
        checked
      });

      row.unshift(html`
        <div class="${classes}">
          <zen-checkbox
            .checked="${checked}"
            @change="${handler.bind(this)}"
            size="small"
          ></zen-checkbox>
        </div>
      `);
    }

    return row;
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
    this.dispatchEvent(
      new CustomEvent(TABLE_EVENTS.tdClick, { detail: row.data })
    );
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-table': ZenTable;
  }
}
