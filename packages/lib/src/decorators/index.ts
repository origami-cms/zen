// import 'reflect-metadata';

export interface Property {
  name?: string;
  type?: any;
  value: any | null;
  reflectToAttribute?: boolean;
  readOnly?: boolean;
  notify?: boolean;
  computed?: string;
  observer?: string;
}

// export const view = (view: string, css?: string) => {
//   return function classDecorator<T extends { new (...args: any[]): {} }>(
//     constructor: T
//   ) {
//     return class WithView extends constructor {
//       static get template() {
//         const t = document.createElement('template');
//         t.innerHTML = `<style>${css}</style>${view}`;
//         return t;
//       }
//     };
//   };
// };

export const bindAttributes = function classDecorator<
  T extends { new (...args: any[]): {} }
>(constructor: T) {
  return class BoundAttributes extends constructor {
    public updated(props: any) {
      // @ts-ignore
      super.updated(props);
      // @ts-ignore
      const attrs = this.constructor._boundAttributes;
      if (attrs && props) {
        Array.from(props.keys()).forEach((k) => {
          if (attrs.includes(k)) {
            // @ts-ignore
            const v = this[k];
            // @ts-ignore
            if (v || v === 0) this.setAttribute(k, this[k]);
            // @ts-ignore
            else this.removeAttribute(k);
          }
        });
      }
    }
  };
};

// function getType(prototype: any, propertyName: string): any {
//   if (Reflect.hasMetadata) {
//     if (Reflect.hasMetadata('design:type', prototype, propertyName)) {
//       return Reflect.getMetadata('design:type', prototype, propertyName);
//     }
//   }
//   return null;
// }

// export const property = (prototype: any, propertyName: string) => {
//   const constructor = prototype.constructor;
//   if (!constructor.hasOwnProperty('properties')) {
//     Object.defineProperty(constructor, 'properties', { value: {} });
//   }
//   constructor.properties[propertyName] = {
//     type: getType(prototype, propertyName) || String
//   };
// };

// export const style = (css: string) => {
//   return function classDecorator<T extends { new (...args: any[]): {} }>(
//     constructor: T
//   ) {
//     return class WithStyle extends constructor {
//       get _style() {
//         return html`
//           ${unsafeHTML(`<style> ${css} </style>`)}
//         ` as TemplateResult;
//       }
//     };
//   };
// };

export const dispatchChange = (
  prop: string = 'value',
  event: string = 'change'
) =>
  function classDecorator<T extends { new (...args: any[]): {} }>(
    constructor: T
  ) {
    return class DispatchChange extends constructor {
      // tslint:disable-next-line
      __firstUpdated = false;

      public updated(changedProps: Map<string, any>) {
        // @ts-ignore
        super.updated(changedProps);

        if (changedProps.has(prop)) {
          if (!this.__firstUpdated) return (this.__firstUpdated = true);
          // @ts-ignore
          if (this[prop] !== changedProps.get(prop)) {
            // @ts-ignore
            this.dispatchEvent(new CustomEvent(event));
          }
        }
      }
    };
  };
