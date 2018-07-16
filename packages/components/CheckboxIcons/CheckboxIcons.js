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
const lit_extended_1 = require("lit-html/lib/lit-extended");
const unsafe_html_1 = require("lit-html/lib/unsafe-html");
const dist_1 = require("polymer3-decorators/dist");
const checkbox_icons_css_1 = __importDefault(require("./checkbox-icons-css"));
let CheckboxIcons = class CheckboxIcons extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.options = [];
        this.value = [];
    }
    _propertiesChanged(p, c, o) {
        super._propertiesChanged(p, c, o);
        if (c && c.columns) {
            this.style.setProperty('--radio-icons-columns', `var(--radio-icons-columns-override, ${p.columns})`);
        }
    }
    _render({ value, options }) {
        return lit_extended_1.html `
            ${checkbox_icons_css_1.default}
            <ul class="options">
                ${options.map(o => lit_extended_1.html `
                    <li
                        class$="option ${value.includes(o.value) ? 'active' : ''}"
                        on-click=${() => this._toggle(o.value)}
                    >
                        <zen-checkbox
                            checked=${value.includes(o.value)}
                            on-click=${() => this._toggle(o.value)}
                        ></zen-checkbox>
                        <div class="img">
                            ${o.icon ? lit_extended_1.html `<zen-icon type=${o.icon}></zen-icon>` : ''}
                            ${o.image ? lit_extended_1.html `<img src=${o.image} />` : ''}
                            ${o.html ? lit_extended_1.html `${unsafe_html_1.unsafeHTML(o.html)}` : ''}
                        </div>
                        <span>${o.label}</span>
                    </li>
                `)}
            </ul>
        `;
    }
    _toggle(v) {
        if (!this.value.includes(v))
            this.value.push(v);
        else
            this.value = this.value.filter(_v => v !== _v);
        this._requestRender();
        this.dispatchEvent(new CustomEvent('change'));
    }
};
__decorate([
    dist_1.property,
    __metadata("design:type", Array)
], CheckboxIcons.prototype, "options", void 0);
__decorate([
    dist_1.property,
    __metadata("design:type", Array)
], CheckboxIcons.prototype, "value", void 0);
__decorate([
    dist_1.property,
    __metadata("design:type", String)
], CheckboxIcons.prototype, "name", void 0);
__decorate([
    dist_1.property,
    __metadata("design:type", Number)
], CheckboxIcons.prototype, "columns", void 0);
CheckboxIcons = __decorate([
    dist_1.component('zen-checkbox-icons')
], CheckboxIcons);
exports.default = CheckboxIcons;
