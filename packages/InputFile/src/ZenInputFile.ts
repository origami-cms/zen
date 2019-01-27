import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';
import CSS from './input-file-css';

@customElement('zen-input-file')
export class ZenInputFile extends LitElement {
  /**
   * Text to display when there is no file selected
   */
  @property()
  public placeholder?: string;

  /**
   * Icon placeholder to display when there is no file selected
   */
  @property()
  public placeholderIcon: string | null = 'upload';

  /**
   * Image placeholder to display when there is no file selected (overrides
   * default placeholder)
   */
  @property()
  public placeholderImg?: string;

  /**
   * Allow for multiple files to be selected
   */
  @property({ type: Boolean })
  public multiple?: boolean = false;

  /**
   * Array of files selected
   */
  public files: File[] = [];

  private _reader = new FileReader();

  /**
   * Preview of image selected
   */
  @property()
  private _img: string | null = null;

  /**
   * Upload or file type icon (if file is selected)
   */
  @property()
  private _icon: string | null = null;

  /**
   * Text to display inside the input
   */
  @property()
  private _text: string | null = null;

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
    this._reader.addEventListener('load', (e) => {
      // @ts-ignore
      this._img = (e.target as EventTarget).result;
    });
  }

  public render() {
    const { placeholder, placeholderIcon, placeholderImg, _img, _icon, _text, files, multiple } = this;

    const img = _img || placeholderImg;
    const $img = html`<img .src="${img}" />`;
    const text = _text || placeholder;
    const $text = html`<span>${text}</span>`;
    const icon = _icon || placeholderIcon;
    // TODO: Expose icon color
    const $icon = html`<zen-icon .type=${icon}></zen-icon>`;

    const content: TemplateResult[] = [];

    // Nothing selected, so use placeholder content
    if (!files.length) {
      if (placeholderImg) content.push($img);
      else {
        if (placeholderIcon) content.push($icon);
        if (placeholder) content.push($text);
      }

      // File selected, so show either image preview or selection details
    } else {
      if (_img) content.push($img);
      else {
        if (_icon) content.push($icon);
        if (_text) content.push($text);
      }
    }

    return html`
      ${CSS}
      ${content}
      <input
        type="file"
        @change="${this._handleChange}"
        placeholder="${placeholder}"
        ?multiple=${multiple}
      />
    `;
  }

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.files = [];
    this._img = null;

    let triggerChange = false;
    // Files are selected
    if (input.files && input.files[0]) {
      // @ts-ignore If a valid file list
      this.files = input.files;
      triggerChange = true;

    // No files selected
    } else {
      // If there is currently files, then setting to no files requires trigger of change
      if (this.files.length) triggerChange = true;
      this.files = [];
    }

    if (triggerChange) this.dispatchEvent(new CustomEvent('change'));


    // No files selected
    if (this.files.length === 0) {
      this._text = null;
      this._icon = null;


    // If there is one file selected, change the icon, or check for image preview
    } else if (this.files.length === 1) {
      this._text = this.files[0].name;

      const f = this.files[0];
      // If file is an image, read it into the preview
      if (f.type.startsWith('image/')) {
        return this._reader.readAsDataURL(this.files[0]);
      }

      switch (f.type.split('/').pop()) {
        case 'zip':
          this._icon = 'file-zip';
          break;

        case 'txt':
        case 'doc':
        case 'docx':
          this._icon = 'file-text';
          break;

        case 'html':
        case 'xml':
          this._icon = 'file-code-xml';
          break;

        case 'javascript':
        case 'json':
          this._icon = 'file-code';
          break;

        case 'xls':
        case 'xlsx':
        case 'xlw':
        case 'xlt':
        case 'csv':
          this._icon = 'file-spreadsheet';
          break;

        default:
          this._icon = 'file';
      }


      // Multiple files selected
    } else {
      this._text = `${this.files.length} files selected`;
      this._icon = 'file-multiple';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // @ts-ignore
    'zen-input-file': ZenInputFile;
  }
}
