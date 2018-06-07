import {html} from '@polymer/lit-element';
import {unsafeHTML} from 'lit-html/lib/unsafe-html';

export const view = (view: string, css?: string) => {
    return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class WithView extends constructor {
            static get template() {
                const t = document.createElement('template');
                t.innerHTML = `<style>${css}</style>${view}`;
                return t;
            }
        };
    };
};

export const bindAttributes = function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class BoundAttributes extends constructor {
        private _propertiesChanged(props: object, changedProps: object, prevProps: object) {
            // @ts-ignore
            super._propertiesChanged(props, changedProps, prevProps);
            // @ts-ignore
            const attrs = (this.constructor as constructor)._boundAttributes;
            if (attrs && changedProps) {
                Object.keys(changedProps).forEach(k => {
                    if (attrs.includes(k)) {
                        // @ts-ignore
                        const v = props[k];
                        // @ts-ignore
                        if (v || v === 0) this.setAttribute(k, props[k]);
                        // @ts-ignore
                        else this.removeAttribute(k);
                    }
                });
            }
        }
    };
};

export const style = (css: string) => {
    return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class WithStyle extends constructor {
            get _style() {
                return html`${unsafeHTML(`<style> ${css} </style>`)}`;
            }
        };
    };
};

export const dispatchChange = (prop: string = 'value', event: string = 'change') =>
    function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class DispatchChange extends constructor {
            _propertiesChanged(props: object, changedProps: object, prevProps: object) {
                // @ts-ignore
                super._propertiesChanged(props, changedProps, prevProps);
                // @ts-ignore
                if (changedProps && changedProps[prop] !== undefined) this.dispatchEvent(new CustomEvent(event));
            }
        };
    };
