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
