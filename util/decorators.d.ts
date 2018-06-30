export declare const view: (view: string, css?: string) => <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {};
    readonly template: HTMLTemplateElement;
} & T;
export declare const bindAttributes: <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        _propertiesChanged(props: object, changedProps: object, prevProps: object): void;
    };
} & T;
export declare const style: (css: string) => <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        readonly _style: any;
    };
} & T;
export declare const dispatchChange: (prop?: string, event?: string) => <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        _propertiesChanged(props: object, changedProps: object, prevProps: object): void;
    };
} & T;
