import { html } from '@polymer/lit-element';
import { unsafeHTML } from 'lit-html/lib/unsafe-html';
export const view = (view, css) => {
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
export const bindAttributes = function classDecorator(constructor) {
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
export const style = (css) => {
    return function classDecorator(constructor) {
        return class WithStyle extends constructor {
            get _style() {
                return html `${unsafeHTML(`<style> ${css} </style>`)}`;
            }
        };
    };
};
export const dispatchChange = (prop = 'value', event = 'change') => function classDecorator(constructor) {
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
