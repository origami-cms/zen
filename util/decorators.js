import { html } from '@polymer/lit-element';
import { unsafeHTML } from 'lit-html/lib/unsafe-html';
import 'reflect-metadata';
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
export const component = (name) => {
    return function (klass) {
        window.customElements.define(name, klass);
    };
};
// export function property(args?: Property): PropertyDecorator;
// export function property(target: Object, key: string | symbol): void;
// export function property(first?: any, second?: any): any {
//     let args: { [key: string]: any };
//     let isGenerator = false;
//     if (second === undefined) {
//         args = first || {};
//         isGenerator = true;
//     } else {
//         args = {};
//     }
//     function decorate(target: any, key: string): void {
//         if (Reflect.hasMetadata('design:type', target, key)) {
//             args.type = Reflect.getMetadata('design:type', target, key);
//         }
//         target.constructor.properties = target.constructor.properties ||  {};
//         target.constructor.properties[key] = (Object as any).assign(args, target.constructor.properties[key] || {});
//     }
//     if (isGenerator) {
//         return decorate;
//     } else {
//         return decorate(first, second);
//     }
// }
function getType(prototype, propertyName) {
    if (Reflect.hasMetadata) {
        if (Reflect.hasMetadata('design:type', prototype, propertyName)) {
            return Reflect.getMetadata('design:type', prototype, propertyName);
        }
    }
    return null;
}
export const property = (prototype, propertyName) => {
    const constructor = prototype.constructor;
    if (!constructor.hasOwnProperty('properties')) {
        Object.defineProperty(constructor, 'properties', { value: {} });
    }
    constructor.properties[propertyName] = { type: getType(prototype, propertyName) || String };
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
