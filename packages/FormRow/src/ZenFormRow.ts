// tslint:disable function-name
import {ZenInput} from '@origami/zen-input';
import { dispatchChange } from '@origami/zen-lib/decorators';
import { Field, ValidationErrors } from '@origami/zen-lib/FormValidator';
import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';
import CSS from './form-row-css';
import { CUSTOM_CONTROL_ATTRIBUTE, renderField } from './renderField';

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

  private _customControls = new Map<HTMLElement, Function>();

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

  /**
   * Automatically add onChange listeners for all elements containing the
   * `data-custom-control` attribute. These elements could be anything (specified)
   * by the `Field.type`, and created in `renderField()`
   */
  public updated() {
    const custom = Array.from(
      this.shadowRoot!.querySelectorAll<HTMLElement>(`*[${CUSTOM_CONTROL_ATTRIBUTE}]`)
    );

    // Loop over all controls, and if there is not event listener set in
    // `this._customControls`, add it
    custom
      .forEach((el) => {
        if (!this._customControls.has(el)) {
          el.addEventListener('change', this._handleChange);
          this._customControls.set(el, this._handleChange);
        }
      });

    // Clean up any elements that are no longer on the page from the map
    // and update their value
    Array.from(this._customControls.entries()).forEach(([e]) => {
      if (!custom.includes(e)) this._customControls.delete(e);
      else (e as HTMLInputElement).value = this.value;
    });
  }


  public focus() {
    if (!this.field) return;
    if (
      ['text', 'number', 'password', 'email', 'date', 'tel'].includes(this.field.type)
    ) {
      (this.shadowRoot!.querySelector('zen-input'))!.focus();
    }
  }

  public submit() {
    this.dispatchEvent(new CustomEvent('submit'));
  }

  public _handleTextAreaKeyUp(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (!e.ctrlKey && !e.metaKey) e.stopPropagation();
    } else this._handleChange(e);
  }

  protected _renderField(f: Field, value: any) {
    return renderField(this, f, value, this._handleChange);
  }

  private _handleChange(e: Event) {
    const t = e.target as HTMLInputElement;
    if (t.tagName === 'ZEN-CHECKBOX') return (this.value = t.checked);

    this.value = t.value;
  }

  private _handleKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        this.dispatchEvent(new CustomEvent('submit'));
    }
  }


}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-form-row': ZenFormRow;
  }
}
