import './styles/index.styl';
import Vue from 'vue';
import { VueConstructor } from 'vue/types/vue';
import * as CSS from 'csstype';
export declare type Listener<T> = (instance: T, type: CloseType, ...args: any[]) => any;
export interface ListenerGroup<T> {
    [key: string]: Listener<T>;
}
export interface RunListenerGroup<T> {
    [key: string]: {
        name: string;
        fn: Listener<T>;
    } | Listener<T>;
}
export interface ModalComponent<T> {
    component: VueConstructor | 'div';
    defaultProps?: Record<string, any>;
    slot?: string;
    on?: ListenerGroup<T>;
    className?: string;
    ref?: string;
}
export declare type ModalItemGroup<T> = (ModalComponent<T> | string)[];
export interface ModalTypesGroup<T> {
    [key: string]: ModalItemGroup<T>;
}
interface BaseConfig {
    awaitClose?: boolean;
    containerStyle?: CSS.Properties;
    containerClass?: string;
    maskClosable?: boolean;
}
export interface ModalRunConfig<T, K> extends BaseConfig {
    type: T & string;
    onClose?: (instance: K, type: CloseType) => any;
    on?: RunListenerGroup<K>;
    props?: {
        [key: string]: any;
    };
}
export interface CreateConfig extends BaseConfig {
    container?: VueConstructor | 'div';
    transitionName?: string;
    closeButtonClass?: string;
    conatainerProps?: {
        [key: string]: any;
    };
}
export declare type CloseType = 'close' | 'custom' | 'instance' | string & {};
export declare type ModalIntance = InstanceType<typeof Component>;
export interface baseResolve {
    instance: ModalIntance;
    type: CloseType;
}
declare const Component: import("vue/types/vue").ExtendedVue<Vue, {
    visible: boolean;
    id: string;
    closed: boolean;
    onClose: <T extends object>(instance: T, type: CloseType, ...args: any[]) => void;
}, {
    /**
     * close modal
     */
    close(type: CloseType, ...args: any[]): void;
    handleAfterLeave(): void;
}, unknown, Record<"$el" | "$options" | "$parent" | "$root" | "$children" | "$refs" | "$slots" | "$scopedSlots" | "$isServer" | "$data" | "$props" | "$ssrContext" | "$vnode" | "$attrs" | "$listeners" | "$mount" | "$forceUpdate" | "$destroy" | "$set" | "$delete" | "$watch" | "$on" | "$once" | "$off" | "$emit" | "$nextTick" | "$createElement", any>>;
declare const createVfModal: <T_1 extends ModalTypesGroup<import("vue/types/vue").CombinedVueInstance<{
    visible: boolean;
    id: string;
    closed: boolean;
    onClose: <T extends object>(instance: T, type: CloseType, ...args: any[]) => void;
} & {
    /**
     * close modal
     */
    close(type: CloseType, ...args: any[]): void;
    handleAfterLeave(): void;
} & Record<"$el" | "$options" | "$parent" | "$root" | "$children" | "$refs" | "$slots" | "$scopedSlots" | "$isServer" | "$data" | "$props" | "$ssrContext" | "$vnode" | "$attrs" | "$listeners" | "$mount" | "$forceUpdate" | "$destroy" | "$set" | "$delete" | "$watch" | "$on" | "$once" | "$off" | "$emit" | "$nextTick" | "$createElement", any> & Vue, object, object, object, Record<never, any>>>>(modalTypesGroup: T_1, createConfig?: CreateConfig | undefined) => (config: ModalRunConfig<keyof T_1, import("vue/types/vue").CombinedVueInstance<{
    visible: boolean;
    id: string;
    closed: boolean;
    onClose: <T extends object>(instance: T, type: CloseType, ...args: any[]) => void;
} & {
    /**
     * close modal
     */
    close(type: CloseType, ...args: any[]): void;
    handleAfterLeave(): void;
} & Record<"$el" | "$options" | "$parent" | "$root" | "$children" | "$refs" | "$slots" | "$scopedSlots" | "$isServer" | "$data" | "$props" | "$ssrContext" | "$vnode" | "$attrs" | "$listeners" | "$mount" | "$forceUpdate" | "$destroy" | "$set" | "$delete" | "$watch" | "$on" | "$once" | "$off" | "$emit" | "$nextTick" | "$createElement", any> & Vue, object, object, object, Record<never, any>>>) => Promise<baseResolve>;
export { createVfModal };
