// tslint:disable function-name

import { ZenFormRow } from '@origami/zen-form-row';
import {
  Field,
  FormValues,
  ValidateFieldErrors,
  Validator
} from '@origami/zen-lib/FormValidator';
import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import { TemplateResult } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import CSS from './form-css';

export const FORM_EVENTS = {
  SUBMIT: 'submit',
  VALIDATED: 'validated',
  CHANGE: 'change',
  DIRTY_CHANGE: 'dirtyChange'
};

@customElement('zen-form')
export class ZenForm extends LitElement {
  @property()
  public values: FormValues = {};

  @property()
  public dirtyValues: FormValues = {};

  @property()
  public error?: string;

  @property()
  public fields: Field[] = [];

  @property()
  public loading: boolean = false;

  @property()
  public fieldErrors: ValidateFieldErrors = {};

  @property()
  public saveable: boolean = false;

  private _validateOnChange: boolean = false;
  private _showErrors: boolean = false;
  private _eventMap: WeakMap<Element, Function> = new WeakMap();

  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  public render() {
    return html`
      ${CSS}
      ${
        this.error
          ? html`
              <div class="error">
                <zen-icon type="error" .color="error"></zen-icon>
                <span>${this.error}</span>
              </div>
            `
          : ''
      }
      <form novalidate @submit="${this.submit}">${this._children}</form>
    `;
  }

  private get _isChildren() {
    return this.fields.length === 0;
  }

  private get _children(): TemplateResult {
    const errors = this.fieldErrors || {};

    // Using this.fields mapped to <form-row>'s
    if (!this._isChildren) {
      return html`
        ${
          repeat(
            this.fields,
            (f) => f.name,
            (f) => {
              let value = this.dirtyValues[f.name];
              if (value === undefined) value = this.values[f.name];

              return html`
                <zen-form-row
                  .field="${f}"
                  .value="${value}"
                  @change="${this._handleChange}"
                  @submit="${this.submit}"
                  .name="${f.name}"
                  .error="${errors[f.name]}"
                  .rowwidth="${f.width}"
                  .disabled="${f.disabled}"
                ></zen-form-row>
              `;
            }
          )
        }
      `;

      // Use slotted children
    } else {
      return html`
        <slot
          @slotchange="${
            () => {
              this.requestUpdate();
              this._updatedSlotted();
            }
          }"
        ></slot>
      `;
    }
  }

  // Query all slotted children with 'name' attributes
  private get _slottedControls(): Element[] | false {
    const s = this.shadowRoot!.querySelector('slot');
    if (!this._isChildren || !s) return false;
    const nodes = s.assignedNodes().filter((n) => n.nodeType === 1) as Element[];

    return nodes.reduce(
      (controls, node) => {
        if (node.hasAttribute('name')) controls.push(node);
        controls.push(...Array.from(node.querySelectorAll('*[name]')));
        return controls;
      },
      [] as Element[]
    );
  }

  public scrollToError() {
    if (!this.fieldErrors) return;
    const row = (Array.from(
      this.shadowRoot!.querySelectorAll('zen-form-row')
    ) as ZenFormRow[]).find((r) => r.name === Object.keys(this.fieldErrors)[0]);
    if (!row) return;
    row.scrollIntoView();

    return row;
  }

  public submit(e?: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!this.validate()) return false;

    const active = this.shadowRoot!.querySelector('*:focus') as HTMLElement;
    if (active && active.blur) active.blur();

    this.dispatchEvent(new CustomEvent(FORM_EVENTS.SUBMIT));

    return false;
  }

  public validate(showErrors: boolean = true) {
    this._validateOnChange = true;
    this._showErrors = showErrors;

    this.fieldErrors = {};

    // TODO: add validation for children path
    const v = new Validator({
      fields: this.fields
    });

    const { valid, fields } = v.validate({
      ...this.values,
      ...this.dirtyValues
    });

    if (fields) {
      this.fieldErrors = fields;
      const row = this.scrollToError();
      if (row) row.focus();
    }

    this.dispatchEvent(
      new CustomEvent(FORM_EVENTS.VALIDATED, {
        detail: { valid }
      })
    );

    return valid;
  }

  public save() {
    if (!this.saveable || this.validate()) {
      this.values = { ...this.values, ...this.dirtyValues };
    }
  }

  // Compares all the dirty values to find one that doesn't match the real values
  get dirty(): Boolean {
    return this._compareObjects(this.dirtyValues, this.values);
  }

  public firstUpdated(p: any) {
    super.firstUpdated(p);
    this._updatedSlotted();
  }

  public updated(p: any) {
    super.updated(p);
    const controls = this._slottedControls;

    if (p.get('values')) {
      if (this._compareObjects(this.values, p.get('values'))) {
        this.dispatchEvent(new CustomEvent(FORM_EVENTS.CHANGE));
        if (!this.dirty) {
          this.dispatchEvent(new CustomEvent(FORM_EVENTS.DIRTY_CHANGE));
        }
      }
    } else if (p.get('dirtyValues')) {
      this.dispatchEvent(
        new CustomEvent(FORM_EVENTS.DIRTY_CHANGE, { detail: this.dirtyValues })
      );
      if (this._showErrors) this.validate();
      if (!this.saveable) this.save();
      // Updates the slotted children
      this._updatedSlotted();

      // Adds the event listeners to the slotted children
    } else if (this._isChildren) {
      if (controls) {
        controls.forEach((c) => {
          if (this._eventMap.has(c)) return;
          c.addEventListener('change', this._handleChange);
          this._eventMap.set(c, this._handleChange);
        });
      }
      // TODO: clear the map
    }
  }

  private _handleChange(e: Event) {
    const t = e.target as HTMLInputElement;
    const v = t[this._getValueNameFromElement(t)];

    if (
      this.dirtyValues[t.name] !== undefined &&
      this.dirtyValues[t.name] === v
    ) {
      return false;
    }

    this.dirtyValues = { ...this.dirtyValues, ...{ [t.name]: v } };
  }

  // Get the value of the input based off the input type
  private _getValueNameFromElement(e: HTMLInputElement) {
    if (
      e.tagName === 'ZEN-CHECKBOX' ||
      (e.tagName === 'INPUT' && e.type === 'checkbox')
    ) {
      return 'checked';
    } else return 'value';
  }

  private _updatedSlotted() {
    const controls = this._slottedControls;
    if (controls) {
      controls.forEach((c) => {
        const i = c as HTMLInputElement;
        // Lookup the value to change based on the element type
        const vName = this._getValueNameFromElement(i);

        // Update the element's value if it's different from form value
        const currentValue =
          this.dirtyValues[i.name] !== undefined
            ? this.dirtyValues[i.name]
            : this.values[i.name];

        if (i[vName] !== currentValue && currentValue !== undefined) {
          i[vName] = currentValue;
        }
      });
    }
  }

  private _compareObjects(obj1: FormValues, obj2: FormValues) {
    return Boolean(Object.keys(obj1).find((k) => obj1[k] !== obj2[k]));
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-form': ZenForm;
  }
}
