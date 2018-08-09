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
export declare const view: (view: string, css?: string | undefined) => <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {};
    readonly template: HTMLTemplateElement;
} & T;
export declare const bindAttributes: <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        _propertiesChanged(props: object, changedProps: object, prevProps: object): void;
    };
} & T;
export declare const component: (name: string) => ClassDecorator;
export declare function property(args?: Property): PropertyDecorator;
export declare function property(target: Object, key: string | symbol): void;
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
