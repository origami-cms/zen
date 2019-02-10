import { Field, FieldCustomElement } from '@origami/zen-lib/FormValidator';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { ZenFormRow } from './ZenFormRow';

export const CUSTOM_CONTROL_ATTRIBUTE = 'data-custom-control';

export const renderField = (row: ZenFormRow, f: Field, value: any, change: (e: Event) => void) => {
  const v = value;
  const c = change;

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
      ></zen-input>`;

    case 'file':
      return html`
      <zen-input-file
        .type="file"
        @change="${c}"
        .placeholder="${f.placeholder}"
        .placeholderIcon="${f.placeholderIcon}"
        .placeholderImg="${f.placeholderImg}"
        .disabled="${f.disabled}"
      ></zen-input-file>`;

    case 'color':
      return html`
      <zen-input-color
        .type="${f.type}"
        .value="${v}"
        @change="${c}"
        .placeholder="${f.placeholder}"
        .disabled="${f.disabled}"
      ></zen-input-color>`;

    case 'textarea':
      return html`
      <textarea
        .value="${ifDefined(v)}"
        @change="${c}"
        @keyup="${row._handleTextAreaKeyUp}"
        placeholder="${ifDefined(f.placeholder)}"
        disabled="${ifDefined(f.disabled)}"
      ></textarea>`;

    case 'submit':
      return html`
      <zen-button
        .icon="${f.icon}"
        @click="${row.submit}"
        .color="${f.color}"
        .disabled="${f.disabled}"
      >
        ${f.value}
      </zen-button>`;

    case 'select':
      return html`
      <zen-select
        .value="${v}"
        @change="${c}"
        .options="${f.options}"
        .placeholder="${f.placeholder}"
        .disabled="${f.disabled}"
      ></zen-select>`;

    case 'checkbox':
      return html`
      <zen-checkbox
        .checked="${v}"
        @change="${c}"
        .disabled="${f.disabled}"
      ></zen-checkbox>`;

    case 'radio':
      return html`
      <zen-radio
        .value="${v}"
        @change="${c}"
        .options="${f.options}"
        .disabled="${f.disabled}"
      ></zen-radio>`;

    case 'radio-tabs':
      return html`
      <zen-radio-tabs
        .value="${v}"
        @change="${c}"
        .options="${f.options}"
        .disabled="${f.disabled}"
      ></zen-radio-tabs>`;

    case 'radio-icons':
      return html`
      <zen-radio-icons
        .value="${v}"
        @change="${c}"
        .options="${f.options}"
        .columns="${f.columns}"
        .disabled="${f.disabled}"
      ></zen-radio-icons>`;

    case 'checkbox-icons':
      return html`
      <zen-checkbox-icons
        .value="${v}"
        @change="${c}"
        .options="${f.options}"
        .columns="${f.columns}"
        .disabled="${f.disabled}"
      ></zen-checkbox-icons>`;

    case 'autocomplete':
      return html`
      <zen-autocomplete
        .icon=${f.icon}
        .value=${v} @change=${c}
        .minlength=${f.minlength}
        .placeholder=${f.placeholder}
        .options=${f.options}
        .disabled=${f.disabled}
        .query=${f.query}>
      </zen-autocomplete>`;

    // case 'rich-text':
    //   return html`
    //   <zen-rich-text-editor
    //     .value="${v}"
    //     @change="${c}"
    //   ></zen-rich-text-editor>`;

    default:
      const cf = f as FieldCustomElement;
      let attrs = '';
      if (cf.attributes) {
        attrs = Object.entries(cf.attributes).reduce((_attrs, [a, _v]) => {
          _attrs += ` ${a}="${_v}"`;
          return _attrs;
        }, '');
      }
      return unsafeHTML(`<${cf.type} ${CUSTOM_CONTROL_ATTRIBUTE} ${attrs}></${cf.type}>`);
  }
};
