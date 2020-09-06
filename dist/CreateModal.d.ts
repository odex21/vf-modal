import { UnwrapRef, TransitionProps, InjectionKey, Component } from 'vue';
import { Emitter } from 'mitt';
interface ModalObj {
    component: any;
    zIndex?: number;
    isOpened?: boolean;
    key?: string;
    props?: Record<string, any>;
}
interface ModalMap {
    [index: string]: Omit<ModalObj, 'key' | 'props'>;
}
declare type Listener = (...args: any[]) => any;
interface CreateConfig<T extends ModalMap> {
    modals: T;
    provide?: () => void;
    maskWrapper?: {
        clickHandler?: Listener;
        classname: string;
    };
    transition?: {
        name: string;
        type: TransitionProps['type'];
    };
    on?: {
        modalOpen?: Listener;
        modalClose?: Listener;
    };
    multipleModal?: boolean;
    closeWhenRouteChanges?: boolean;
    fixWrapperClassname?: string;
    container?: string | Component;
}
interface VfModalInstanceState {
    renderList: RenderList;
    close: (key?: string) => void;
    emitter: Emitter;
}
declare type RenderItemOptTemp = Required<Omit<ModalObj, 'component'>>;
interface RenderItemOpt extends RenderItemOptTemp {
    mutiKey?: string;
}
declare type RenderList = UnwrapRef<RenderItemOpt[]>;
export declare const VfMODAL_STORE_KEY: InjectionKey<VfModalInstanceState>;
export declare const createVfModal: <T extends ModalMap>(config: CreateConfig<T>) => {
    VfModal: {
        new (...args: any[]): import("vue").ComponentPublicInstance<{}, () => JSX.Element, {}, {}, {}, Record<string, any>, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>;
        __isFragment?: undefined;
        __isTeleport?: undefined;
        __isSuspense?: undefined;
    } & import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string> & {
        props?: undefined;
    } & ThisType<import("vue").ComponentPublicInstance<{}, () => JSX.Element, {}, {}, {}, Record<string, any>, Readonly<{}>, import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>>;
    Controller: {
        open: (key: keyof T & string, props?: Record<string, any>, zIndex?: number) => {
            emitter: Emitter;
            isClosed: () => Promise<unknown>;
            close: () => void;
        };
        close: (key?: (keyof T & string) | undefined, opt?: {
            closeModal?: boolean | undefined;
            mutiKey?: string | undefined;
        } | undefined) => void;
        isClosed: (key?: (keyof T & string) | undefined) => Promise<void>;
    };
};
export {};
