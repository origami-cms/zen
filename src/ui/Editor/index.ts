import grapesjs from './lib/grapesjs.min';
import Element from '../../lib/Element';

import HTML from './editor.html';
import CSS from './editor.scss';

window.customElements.define('zen-ui-editor', class Editor extends Element {
    private _editor: HTMLElement;
    editor: any;
    constructor() {
        super(HTML, CSS.toString());

        this._editor = this._root.querySelector('#editor') as HTMLElement;
    }

    connectedCallback() {
        super.connectedCallback();
        this._editor = this._root.querySelector('#editor') as HTMLElement;

        this.editor = grapesjs.init({
            container: this._editor
        });
    }

    static get boundProps() {
        return ['fields', 'values', 'error'];
    }

    // static get defaultProps() {
    //     return {
    //         fields: [],
    //         values: {}
    //     };
    // }

    // static get observedAttributes() {
    //     return [
    //         'fields'
    //     ];
    // }

    // attributeChangedCallback(attr, oldV, newV) {
    //     switch (attr) {
    //         case 'fields':
    //             this[attr] = newV;
    //     }
    // }

    // async propertyChangedCallback(prop) {
    //     await this.ready();
    //     switch (prop) {
    //         case 'error':
    //             this.updateError();
    //             break;

    //         default:
    //             break;
    //     }
    // }

    // updateError() {
    //     const err = this._sr.querySelector('.error');
    //     if (err) err.classList.toggle('hide', !this.error);
    // }

    // render() {
    //     super.render();
    //     this.fields.map(f => {
    //         let existing = this._sr.querySelector(`*[name='${f.name}'`);
    //         if (!existing && f.type == 'submit') existing = this._sr.querySelector('*[type="submit"');
    //         const v = this.values[f.name] || '';
    //         if (existing) {
    //             existing.value = v;
    //             if (f.type == 'submit') existing.value = f.value || 'Submit';

    //             return;
    //         }

    //         const row = document.importNode(
    //             this.templates['form-row'],
    //             true
    //         ).querySelector('div');

    //         const field = this.createField(f, v);
    //         if (!field) return;

    //         const icon = row.querySelector('zen-ui-icon');
    //         if (f.icon) {
    //             icon.type = f.icon;
    //             icon.color = f.iconColor || 'shade-5';
    //         } else icon.remove();

    //         row.appendChild(field);
    //         this.form.appendChild(row);
    //     });

    //     this.updateError();
    // }

    // createField(f, v) {
    //     let field = document.createElement('input');

    //     const keyup = () => {
    //         this.values = {
    //             ...this.values,
    //             ...{[f.name]: field.value}
    //         };
    //     };

    //     switch (f.type) {
    //         case 'textarea':
    //             field = document.createElement('textarea');
    //             field.value = v;
    //             field.name = f.name;
    //             field.addEventListener('keyup', keyup);
    //             field.placeholder = f.placeholder;
    //             break;

    //         case 'text':
    //         case 'input':
    //         case 'password':
    //         case 'email':
    //             field.value = v;
    //             field.name = f.name;
    //             field.type = f.type;
    //             field.addEventListener('keyup', keyup);
    //             field.placeholder = f.placeholder;
    //             break;

    //         case 'submit':
    //             field.type = f.type;
    //             field.value = f.value || 'Submit';
    //             break;

    //         default:
    //             console.warn(`Field type '${f.type}' is not supported`);

    //             return null;
    //     }

    //     return field;
    // }


    // submit(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     const event = document.createEvent('CustomEvent');
    //     event.initCustomEvent('submit', false, false, {});
    //     this.dispatchEvent(event);

    //     return false;
    // }
});
