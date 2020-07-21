import { UnwrapRef, ComponentPublicInstance, TransitionProps, InjectionKey } from 'vue';
interface ModalObj {
    component: any;
    zIndex?: number;
    isOpened?: boolean;
    key?: string;
}
interface ModalMap {
    [index: string]: Omit<ModalObj, 'key'>;
}
declare type Listener = (...args: any[]) => any;
interface CreateConfig {
    modals: ModalMap;
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
        modalOpen: Listener;
        [x: string]: Listener;
    };
    multipleModal?: boolean;
}
interface VfModalInstanceState {
    renderList: UnwrapRef<Required<ModalObj>[]>;
    close: (key?: string | number | undefined) => void;
}
export declare const VfMODAL_STORE_KEY: InjectionKey<VfModalInstanceState>;
export declare const createVfModal: (config: CreateConfig) => {
    VfModal: (new () => ComponentPublicInstance<{}, () => JSX.Element, {}, {}, {}, Record<string, any>, import("vue").VNodeProps, import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>) & import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string> & {
        props?: undefined;
    } & ThisType<ComponentPublicInstance<{}, () => JSX.Element, {}, {}, {}, Record<string, any>, Readonly<{}>, import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>>;
    Controller: {
        open: (key: string, zIndex?: number) => void;
        close: (key?: string | number | undefined, closeModal?: boolean) => void;
        closed: Promise<void>;
    };
};
export {};
