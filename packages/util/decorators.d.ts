import { TemplateResult } from 'lit-html';
export declare const view: (view: string, css?: string | undefined) => <T extends new (...args: any[]) => {}>(constructor: T) => {
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
        readonly _style: TemplateResult;
    };
} & T;
export declare const dispatchChange: (prop?: string, event?: string) => <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        _propertiesChanged(props: object, changedProps: object, prevProps: object): void;
    };
} & T;
