"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lit_element_1 = require("@polymer/lit-element");
const unsafe_html_1 = require("lit-html/lib/unsafe-html");
exports.view = (view, css) => {
    return function classDecorator(constructor) {
        return class WithView extends constructor {
            static get template() {
                const t = document.createElement('template');
                t.innerHTML = `<style>${css}</style>${view}`;
                return t;
            }
        };
    };
};
exports.bindAttributes = function classDecorator(constructor) {
    return class BoundAttributes extends constructor {
        _propertiesChanged(props, changedProps, prevProps) {
            // @ts-ignore
            super._propertiesChanged(props, changedProps, prevProps);
            // @ts-ignore
            const attrs = this.constructor._boundAttributes;
            if (attrs && changedProps) {
                Object.keys(changedProps).forEach(k => {
                    if (attrs.includes(k)) {
                        // @ts-ignore
                        const v = props[k];
                        // @ts-ignore
                        if (v || v === 0)
                            this.setAttribute(k, props[k]);
                        // @ts-ignore
                        else
                            this.removeAttribute(k);
                    }
                });
            }
        }
    };
};
exports.style = (css) => {
    return function classDecorator(constructor) {
        return class WithStyle extends constructor {
            get _style() {
                return lit_element_1.html `${unsafe_html_1.unsafeHTML(`<style> ${css} </style>`)}`;
            }
        };
    };
};
exports.dispatchChange = (prop = 'value', event = 'change') => function classDecorator(constructor) {
    return class DispatchChange extends constructor {
        _propertiesChanged(props, changedProps, prevProps) {
            // @ts-ignore
            super._propertiesChanged(props, changedProps, prevProps);
            // @ts-ignore
            if (changedProps && changedProps[prop] !== undefined)
                this.dispatchEvent(new CustomEvent(event));
        }
    };
};
