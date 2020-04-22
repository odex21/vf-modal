import './styles/index.styl';
import Vue from 'vue';
import { VueConstructor } from 'vue/types/vue';
interface DiaglogKeyC {
    component?: VueConstructor;
    title?: string;
    defaultData?: Record<string, any>;
}
declare type DialogConfigKey = (DiaglogKeyC | string)[];
interface DialogTypesAGroup {
    [key: string]: DialogConfigKey;
}
interface DialolgRunConfig<T> {
    transitionName: string;
    type: T & string & number;
    data: {
        [key: string]: any;
    };
}
interface BaseConfig {
    container?: VueConstructor | 'div';
    containerClass?: string;
    data?: {
        [key: string]: any;
    };
}
declare const RDialog: <T extends DialogTypesAGroup>(dialogTypes: T, baseConfig: BaseConfig) => (config: DialolgRunConfig<keyof T>) => import("vue/types/vue").CombinedVueInstance<Record<never, any> & Vue, {
    visible: boolean;
    closed: boolean;
    id: string;
}, {
    close(ev: any): void;
    handleAfterLeave(): void;
}, object, Record<"onClose", any>>;
export { RDialog };
