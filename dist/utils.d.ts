/// <reference types="node_modules/ts-toolbelt/out" />
declare const findKey: import("Function/Curry").Curry<(arr: any, key: any) => boolean>;
declare const prevent: (e: Event) => void;
declare const stop: (e: Event) => void;
declare const generateClass: (list: string[]) => string;
export { findKey, prevent, stop, generateClass };
