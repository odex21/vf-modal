import { UnwrapRef, ComponentPublicInstance, TransitionProps, InjectionKey } from 'vue';
interface ModalObj {
    component: any;
    zIndex?: number;
    isOpened?: boolean;
    _key?: string;
}
interface ModalMap {
    [index: string]: Omit<ModalObj, '_key'>;
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
<<<<<<< HEAD
    multipleModal?: boolean;
=======
>>>>>>> e47363a... temp
}
interface VfModalInstanceState {
    renderList: UnwrapRef<Required<ModalObj>[]>;
    close: (key?: string | number | undefined) => void;
}
export declare const VfMODAL_STORE_KEY: InjectionKey<VfModalInstanceState>;
export declare const createVfModal: (config: CreateConfig) => {
<<<<<<< HEAD
    VfModal: (new () => ComponentPublicInstance<{}, () => JSX.Element, {}, {}, {}, Record<string, any>, import("vue").VNodeProps, import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>) & import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string> & {
        props?: undefined;
    } & ThisType<ComponentPublicInstance<{}, () => JSX.Element, {}, {}, {}, Record<string, any>, Readonly<{}>, import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>>;
    Controller: {
        open: (key: string, zIndex?: number) => void;
        close: (key?: string | number | undefined, closeModal?: boolean) => void;
        closed: Promise<void>;
    };
=======
    VfModal: (new () => ComponentPublicInstance<{} & {
        msg?: string | undefined;
    }, () => JSX.Element, {}, {}, {}, Record<string, any>, import("vue").VNodeProps, import("vue").ComponentOptionsBase<{} & {
        msg?: string | undefined;
    }, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>) & import("vue").ComponentOptionsBase<Readonly<{
        msg: string;
    } & {}>, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string> & {
        props: {
            msg: {
                default: string;
                type: StringConstructor;
            };
        };
    } & ThisType<ComponentPublicInstance<Readonly<{
        msg: string;
    } & {}>, () => JSX.Element, {}, {}, {}, Record<string, any>, Readonly<{
        msg: string;
    } & {}>, import("vue").ComponentOptionsBase<Readonly<{
        msg: string;
    } & {}>, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>>;
    openModal: (key: string, zIndex?: number) => void;
    close: (key?: string | number | undefined) => void;
    closed: Promise<void>;
>>>>>>> e47363a... temp
};
export {};
