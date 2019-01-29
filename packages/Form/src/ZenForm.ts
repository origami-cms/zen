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
  /**
   * Values of the form as a JSON object
   */
  @property()
  public values: FormValues = {};

  /**
   * Changed values of the form as a JSON object since save() was called
   */
  @property()
  public dirtyValues: FormValues = {};

  /**
   * Error to display at the top of the Form
   */
  @property()
  public error?: string;

  /**
   * Array of Fields to render in the form.
   */
  @property()
  public fields: Field[] = [];

  /**
   * Set the loading state of the form to disable the components and update the
   * submit button
   */
  @property()
  public loading: boolean = false;

  /**
   * Errors specific to each field
   */
  @property()
  public fieldErrors: ValidateFieldErrors = {};

  /**
   * If form is saveable, values will not be updated until save() is called
   */
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

  /**
   * Determine if the form is rendering children from the LightDOM, or from the
   * fields` property
   */
  private get _isChildren() {
    return this.fields.length === 0;
  }

  /**
   * Render the children from `fields` JSON if set, otherwise expose a <slot>
   * element for LightDOM children
   */
  private get _children(): TemplateResult {
    const errors = this.fieldErrors || {};

    // Generate the <form-row>'s for each field in `this.fields`
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

      // Expose a slot for LightDOM slotted children
    } else {
      return html`
        <slot
          @slotchange="${
            () => {
              this.requestUpdate();
              this._updateSlottedElementValues();
            }
          }"
        ></slot>
      `;
    }
  }

  /**
   * Deeply queries for all descendants (slotted LightDOM, or controlled
   * <form-row>'s) that have the `name` attribute
   */
  private get _slottedControls(): Element[] | false {
    // Return false if there are no fields and no slotted elements
    const s = this.shadowRoot!.querySelector('slot');
    if (!this._isChildren || !s) return false;

    const nodes = s.assignedNodes().filter((n) => n.nodeType === 1) as Element[];

    return nodes.reduce(
      (controls, node) => {
        // If current node is has `name` attribute add it
        if (node.hasAttribute('name')) controls.push(node);
        // Otherwise search for any children that have `name` attribute
        else controls.push(...Array.from(node.querySelectorAll('*[name]')));
        return controls;
      },
      [] as Element[]
    );
  }

  /**
   * Scrolls the page to the first <form-row> that contains an error
   */
  public scrollToError() {
    if (!this.fieldErrors) return;
    const row = (Array.from(
      this.shadowRoot!.querySelectorAll('zen-form-row')
    ) as ZenFormRow[]).find((r) => r.name === Object.keys(this.fieldErrors)[0]);
    if (!row) return;
    row.scrollIntoView();

    return row;
  }

  /**
   * Validates the form fields, and if successful, submits the form
   * @param e Form submission event
   */
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

  /**
   * Validates each of the fields against a Validator
   * @param showErrors Set the form to show errors on update
   */
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

    // If there are field errors, focus on the error
    if (fields) {
      this.fieldErrors = fields;
      const row = this.scrollToError();
      if (row) row.focus();
    }

    // Dispatch the valid event with the valid state
    this.dispatchEvent(
      new CustomEvent(FORM_EVENTS.VALIDATED, {
        detail: { valid }
      })
    );

    return valid;
  }

  /**
   * Update the `values` with the `dirtyValues`. If `saveable` is false,
   * the fields are not validated.
   */
  public save() {
    if (!this.saveable || this.validate()) {
      this.values = { ...this.values, ...this.dirtyValues };
    }
  }

  /**
   * Determine if the `dirtyValues` are different to the current `values`
   */
  get dirty(): Boolean {
    return this._compareObjects(this.dirtyValues, this.values);
  }

  public firstUpdated(p: any) {
    super.firstUpdated(p);
    // Set the slotted childrens value on first render
    this._updateSlottedElementValues();
  }


  public updated(p: any) {
    super.updated(p);
    const controls = this._slottedControls;

    // Dispatch `change` or `dirtyChange` events if the values are changed
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

      // Updates the slotted children's values
      this._updateSlottedElementValues();

    } else if (this._isChildren) {
      // Adds the event listeners to the slotted children
      // All slotted children should dispatch a 'change' event with a 'value'
      // property so that Form can control them
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

  /**
   * Retrieve the value from the updated element and update the dirty values
   * @param e Change event
   */
  private _handleChange(e: Event) {
    const t = e.target as HTMLInputElement;
    // Lookup the right attribute to get the value depending on the elements
    // tag name
    const v = t[this._getValueNameFromElement(t)];

    // If the dirty value is already set to this value, skip the update
    // (Cause by wrongly or doubly calling _handleChange)
    if (
      this.dirtyValues[t.name] !== undefined &&
      this.dirtyValues[t.name] === v
    ) {
      return false;
    }

    // Update the dirty values with the new value
    this.dirtyValues = { ...this.dirtyValues, ...{ [t.name]: v } };
  }

  /**
   * Get the value of a field based off the field's tag name/attributes type
   * @param e HTMLElement to get the value from
   */
  private _getValueNameFromElement(e: HTMLInputElement) {
    if (
      e.tagName === 'ZEN-CHECKBOX' ||
      (e.tagName === 'INPUT' && e.type === 'checkbox')
    ) {
      return 'checked';
    } else return 'value';
  }

  /**
   * Updates each of the slotted LightDOM children with the dirty values
   */
  private _updateSlottedElementValues() {
    const controls = this._slottedControls;
    if (controls) {
      controls.forEach((c) => {
        const i = c as HTMLInputElement;
        // Lookup the value to change based on the element type
        const vName = this._getValueNameFromElement(i);

        // Get the `dirtyValues` falling back to the `values` value
        const currentValue =
          this.dirtyValues[i.name] !== undefined
            ? this.dirtyValues[i.name]
            : this.values[i.name];

        // Update the element's value if it's different from form value
        if (i[vName] !== currentValue && currentValue !== undefined) {
          i[vName] = currentValue;
        }
      });
    }
  }

  /**
   * Shallowly check if two objects entries are different
   * @param obj1 Any object
   * @param obj2 Any object
   */
  private _compareObjects(obj1: FormValues, obj2: FormValues) {
    return Boolean(
      Object.keys(obj1)
        .find((k) => obj1[k] !== obj2[k])
    );
  }
}


declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-form': ZenForm;
  }
}
