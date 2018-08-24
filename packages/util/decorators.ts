import {html} from '@polymer/lit-element';
import {unsafeHTML} from 'lit-html/lib/unsafe-html';
import { TemplateResult } from 'lit-html';
import 'reflect-metadata';

export interface Property {
    name?: string;
    type?: any;
    value?: any;
    reflectToAttribute?: boolean;
    readOnly?: boolean;
    notify?: boolean;
    computed?: string;
    observer?: string;
}

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
        _propertiesChanged(props: object, changedProps: object, prevProps: object) {
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
                        if (v || v === 0) this.setAttribute(k, props[k]);
                        // @ts-ignore
                        else this.removeAttribute(k);
                    }
                });
            }
        }
    };
};

export const component = (name: string): ClassDecorator => {
    return function (klass: Function) {
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

function getType(prototype: any, propertyName: string): any {
    if (Reflect.hasMetadata) {
        if (Reflect.hasMetadata('design:type', prototype, propertyName)) {
            return Reflect.getMetadata('design:type', prototype, propertyName);
        }
    }
    return null;
}

export const property = (prototype: any, propertyName: string) => {
    const constructor = prototype.constructor;
    if (!constructor.hasOwnProperty('properties')) {
        Object.defineProperty(constructor, 'properties', { value: {} });
    }
    constructor.properties[propertyName] = { type: getType(prototype, propertyName) || String };
};

export const style = (css: string) => {
    return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class WithStyle extends constructor {
            get _style() {
                return html`${unsafeHTML(`<style> ${css} </style>`)}` as TemplateResult;
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
