import { UnwrapRef, TransitionProps, InjectionKey } from 'vue';
import { Emitter } from 'mitt';
interface ModalObj {
    component: any;
    zIndex?: number;
    isOpened?: boolean;
    key?: string;
    emitter: Emitter;
}
interface ModalMap {
    [index: string]: Omit<ModalObj, 'key' | 'emitter'>;
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
}
interface VfModalInstanceState {
    renderList: RenderList;
    close: (key?: string | number | undefined) => void;
}
declare type RenderList = UnwrapRef<Required<Omit<ModalObj, 'component'>>[]>;
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
        open: (key: keyof T & string, zIndex?: number) => {
            emitter: Emitter;
            isClosed: () => Promise<unknown>;
        };
        close: (key?: (keyof T & string) | undefined, closeModal?: boolean) => void;
        isClosed: (key?: (keyof T & string) | undefined) => Promise<void>;
    };
};
export {};
