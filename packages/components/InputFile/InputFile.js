"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_element_1 = require("@polymer/lit-element");
const input_file_css_1 = __importDefault(require("./input-file-css"));
const dist_1 = require("polymer3-decorators/dist");
let InputFile = class InputFile extends lit_element_1.LitElement {
    constructor() {
        super();
        this.files = [];
        this._reader = new FileReader();
        this._icon = 'upload';
        this._handleChange = this._handleChange.bind(this);
        this._reader.addEventListener('load', e => {
            // @ts-ignore
            this._img = e.target.result;
        });
    }
    _render({ placeholder, _img, _icon }) {
        let img = _img;
        if (!img && placeholder)
            img = placeholder;
        return lit_element_1.html `
            ${input_file_css_1.default}
            ${img
            ? lit_element_1.html `<img src=${img} />`
            : lit_element_1.html `<zen-icon type=${_icon} color="grey-200"></zen-icon>`}

            <input type="file" on-change=${this._handleChange}>
        `;
    }
    _handleChange(e) {
        const input = e.target;
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
};
__decorate([
    dist_1.property,
    __metadata("design:type", String)
], InputFile.prototype, "placeholder", void 0);
__decorate([
    dist_1.property,
    __metadata("design:type", Object)
], InputFile.prototype, "_img", void 0);
__decorate([
    dist_1.property,
    __metadata("design:type", String)
], InputFile.prototype, "_icon", void 0);
InputFile = __decorate([
    dist_1.component('zen-input-file'),
    __metadata("design:paramtypes", [])
], InputFile);
exports.default = InputFile;
