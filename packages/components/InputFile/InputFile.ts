import {LitElement, html} from '@polymer/lit-element';
import CSS from './input-file-css';
import {component, property} from 'polymer3-decorators/dist';

interface props {
    _img?: any;
    _icon: string;
}

@component('zen-input-file')
export default class ImageUploader extends LitElement implements props {
    files: File[] = [];

    private _reader = new FileReader();
    @property
    _img?: any;
    @property
    _icon: string = 'upload';

    constructor() {
        super();
        this._handleChange = this._handleChange.bind(this);
        this._reader.addEventListener('load', e => {
            // @ts-ignore
            this._img = (e.target as EventTarget).result;
        });
    }

    _render({_img, _icon}: props) {
        return html`
            ${CSS}
            ${_img
                ? html`<img src=${_img} />`
                : html`<zen-icon type=${_icon} color="grey-200"></zen-icon>`
            }

            <input type="file" on-change=${this._handleChange}>
        `;
    }

    private _handleChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            // @ts-ignore
            this.files = input.files;
            this.dispatchEvent(new CustomEvent('change'));

            const f = input.files[0];
            // If file is an image, read it into the preview
            if (f.type.startsWith('image/')) {
                return this._reader.readAsDataURL(input.files[0]);
            }

            switch (f.type) {
                case 'application/zip':
                    this._icon = 'file-zip';
                    break;

                case 'text':
                    this._icon = 'file-text';

                case 'html':
                case 'xml':
                    this._icon = 'file-code-xml';

                case 'js':
                case 'json':
                    this._icon = 'file-code';

                default:
                    this._icon = 'file';
            }
        }
    }
}
