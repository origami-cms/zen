import { dispatchChange } from '@origami/zen-lib/decorators';
import { customElement, html, LitElement } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import quill, { Quill, QuillOptionsStatic } from 'quill';
// @ts-ignore
import { ImageUpload } from 'quill-image-upload';
import CSS from './editor-css-formatted';

quill.register('modules/imageUpload', ImageUpload);

// @ts-ignore
@customElement('zen-rich-text-editor')
@dispatchChange()
export class ZenRTEditor extends LitElement {
  public editor?: Quill;

  get value() {
    if (!this.editor) return '';
    return this.editor.root.innerHTML;
  }
  set value(v: string) {
    if (!this.editor) {
      this._initialText = v;
      return;
    }
    if (this.value === v) return;
    this.editor.setText(v);
  }
  public _initialText?: string;

  public render() {
    return html`
      ${CSS}
      <div class="editor">
        ${this._initialText ? unsafeHTML(this._initialText) : ''}
      </div>
    `;
  }

  public firstUpdated(p: any) {
    super.firstUpdated(p);

    const opts: QuillOptionsStatic = {
      modules: {
        toolbar: [['bold', 'italic'], ['link', 'image']],
        imageUpload: {
          url: '/api/v1/media',
          method: 'POST',
          headers: {
            Authorization: localStorage.getItem('token')
          },
          callbackOK: (res: any, next: any) => {
            next(`/api/v1/media/${res.data.id}`);
          }
          // callbackKO: (serverError: any) => {
          //     // TODO: Handle server error
          // }
        }
      },
      theme: 'snow'
    };

    this.editor = new quill(this.shadowRoot!.querySelector('.editor')!, opts);
    this.editor.on('text-change', () => {
      this.dispatchEvent(new CustomEvent('change'));
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-rich-text-editor': ZenRTEditor;
  }
}
