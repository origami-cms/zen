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
const input_color_css_1 = __importDefault(require("./input-color-css"));
const polymer3_decorators_1 = require("polymer3-decorators");
let InputColor = class InputColor extends lit_element_1.LitElement {
    constructor() {
        super();
        this.value = null;
        this.placeholder = null;
        this._handleChange = this._handleChange.bind(this);
    }
    _render({ value, placeholder }) {
        return lit_element_1.html `
            ${input_color_css_1.default}
            <div class="color" style="background-color: ${value}">
                <zen-icon type="eyedropper" color="${value ? 'white' : 'grey-300'}"></zen-icon>
            </div>
            <span>${value || placeholder || ''}</span>
            <input type="color" on-change=${this._handleChange}>
        `;
    }
    _handleChange(e) {
        const input = e.target;
        this.value = input.value;
        this.dispatchEvent(new CustomEvent('change'));
    }
};
__decorate([
    polymer3_decorators_1.property,
    __metadata("design:type", Object)
], InputColor.prototype, "value", void 0);
__decorate([
    polymer3_decorators_1.property,
    __metadata("design:type", Object)
], InputColor.prototype, "placeholder", void 0);
InputColor = __decorate([
    polymer3_decorators_1.component('zen-input-color'),
    __metadata("design:paramtypes", [])
], InputColor);
exports.default = InputColor;
