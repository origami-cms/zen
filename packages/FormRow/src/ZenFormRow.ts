// tslint:disable function-name
import { ZenInput } from '@origami/zen-input';
import { dispatchChange } from '@origami/zen-lib/decorators';
import { Field, ValidationErrors } from '@origami/zen-lib/FormValidator';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import { TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import CSS from './form-row-css';

export interface FormRowProps {
  field?: Field;
  name?: string;
  value: any | null;
  error?: ValidationErrors;
  rowwidth?: 'half';
  hidden: boolean;
  disabled: boolean;
}

// @ts-ignore
@customElement('zen-form-row')
@dispatchChange()
export class ZenFormRow extends LitElement implements FormRowProps {
  @property()
  public field?: Field;

  @property()
  public name?: string;

  @property()
  public value: any | null = null;

  @property()
  public error?: ValidationErrors;

  @property({ reflect: true, type: String })
  public rowwidth?: 'half';

  public hidden: boolean = false;

  @property({ reflect: true, type: Boolean })
  public disabled: boolean = false;

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
    this._handleTextAreaKeyUp = this._handleTextAreaKeyUp.bind(this);
    this.submit = this.submit.bind(this);

    this.addEventListener('keyup', this._handleKeyUp.bind(this));
  }

  public render(): TemplateResult {
    const { error, field, value } = this;

    let e;
    if (error) e = Object.values(error)[0];

    if (!field) return html``;
    const f = this._renderField(field, value);

    return html`
      ${CSS}
      ${
        e
          ? html`
              <span class="error">
                <zen-icon type="error" .color="error"></zen-icon>
                ${e}
              </span>
            `
          : ''
      }
      ${
        field.label
          ? html`
              <span class="label">${field.label}</span>
            `
          : ''
      }
      ${f}
    `;
  }

  public focus() {
    if (!this.field) return;
    if (
      ['text', 'number', 'password', 'email', 'date', 'tel'].includes(
        this.field.type
      )
    ) {
      this.shadowRoot!.querySelector('zen-input')!.focus();
    }
  }

  public _renderField(f: Field, value: any) {
    const v = value;
    const c = this._handleChange;
    switch (f.type) {
      case 'text':
      case 'number':
      case 'password':
      case 'email':
      case 'date':
      case 'tel':
        return html`
          <zen-input
            .type="${f.type}"
            .icon="${f.icon}"
            .value="${v}"
            @change="${c}"
            .placeholder="${f.placeholder}"
            .disabled="${f.disabled}"
          ></zen-input>
        `;

      case 'file':
        return html`
          <zen-input-file
            .type="file"
            @change="${c}"
            .placeholder="${f.placeholder}"
            .placeholderIcon="${f.placeholderIcon}"
            .placeholderImg="${f.placeholderImg}"
            .disabled="${f.disabled}"
          ></zen-input-file>
        `;

      case 'color':
        return html`
          <zen-input-color
            .type="${f.type}"
            .value="${v}"
            @change="${c}"
            .placeholder="${f.placeholder}"
            .disabled="${f.disabled}"
          ></zen-input-color>
        `;

      case 'textarea':
        return html`
          <textarea
            .value="${ifDefined(v)}"
            @change="${c}"
            @keyup="${this._handleTextAreaKeyUp}"
            placeholder="${ifDefined(f.placeholder)}"
            disabled="${ifDefined(f.disabled)}"
          ></textarea>
        `;

      case 'submit':
        return html`
          <zen-button
            .icon="${f.icon}"
            @click="${this.submit}"
            .color="${f.color}"
            .disabled="${f.disabled}"
            >${f.value}</zen-button
          >
        `;

      case 'select':
        return html`
          <zen-select
            .value="${v}"
            @change="${c}"
            .options="${f.options}"
            .placeholder="${f.placeholder}"
            .disabled="${f.disabled}"
          ></zen-select>
        `;

      case 'checkbox':
        return html`
          <zen-checkbox
            .checked="${v}"
            @change="${c}"
            .disabled="${f.disabled}"
          ></zen-checkbox>
        `;

      case 'radio':
        return html`
          <zen-radio
            .value="${v}"
            @change="${c}"
            .options="${f.options}"
            .disabled="${f.disabled}"
          ></zen-radio>
        `;

      case 'radio-tabs':
        return html`
          <zen-radio-tabs
            .value="${v}"
            @change="${c}"
            .options="${f.options}"
            .disabled="${f.disabled}"
          ></zen-radio-tabs>
        `;

      case 'radio-icons':
        return html`
          <zen-radio-icons
            .value="${v}"
            @change="${c}"
            .options="${f.options}"
            .columns="${f.columns}"
            .disabled="${f.disabled}"
          ></zen-radio-icons>
        `;

      case 'checkbox-icons':
        return html`
          <zen-checkbox-icons
            .value="${v}"
            @change="${c}"
            .options="${f.options}"
            .columns="${f.columns}"
            .disabled="${f.disabled}"
          ></zen-checkbox-icons>
        `;

      case 'autocomplete':
        return html`<zen-autocomplete
                    .icon=${f.icon}
                    .value=${v}
                    @change=${c}
                    .minlength=${f.minlength}
                    .placeholder=${f.placeholder}
                    .options=${f.options}
                    .disabled=${f.disabled}
                    .query=${f.query}
                ></<zen-autocomplete>`;

      case 'rich-text':
        return html`
          <zen-rich-text-editor
            .value="${v}"
            @change="${c}"
          ></zen-rich-text-editor>
        `;

      default:
        console.warn(`No element found for ${f.type}`);
        return html``;
    }
  }

  private _handleChange(e: Event) {
    const t = e.target as HTMLInputElement;
    if (t.tagName === 'ZEN-CHECKBOX') return (this.value = t.checked);

    this.value = t.value;
  }

  private submit() {
    this.dispatchEvent(new CustomEvent('submit'));
  }

  private _handleKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        this.dispatchEvent(new CustomEvent('submit'));
    }
  }

  private _handleTextAreaKeyUp(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (!e.ctrlKey && !e.metaKey) e.stopPropagation();
    } else this._handleChange(e);
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-form-row': ZenFormRow;
  }
}
