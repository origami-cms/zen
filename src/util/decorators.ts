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
            if (attrs) {
                attrs.forEach((a: string) => {
                    // @ts-ignore
                    if (props[a]) this.setAttribute(a, props[a]);
                    // @ts-ignore
                    else this.removeAttribute(a);
                });
            }
        }
    };
};

export const style = (css: string) => {
    return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class WithStyle extends constructor {
            private get _style() {
                return html`${unsafeHTML(`<style> ${css} </style>`)}`;
            }
        };
    };
};
