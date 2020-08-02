import { UnwrapRef, TransitionProps, InjectionKey } from 'vue';
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
    VfModal: (new () => import("vue").ComponentPublicInstance<{}, () => JSX.Element, {}, {}, {}, Record<string, any>, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>) & import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string> & {
        props?: undefined;
    } & ThisType<import("vue").ComponentPublicInstance<{}, () => JSX.Element, {}, {}, {}, Record<string, any>, Readonly<{}>, import("vue").ComponentOptionsBase<{}, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string>>>;
    Controller: {
        open: (key: keyof T & string, zIndex?: number) => () => Promise<void>;
        close: (key?: (keyof T & string) | undefined, closeModal?: boolean) => void;
        isClosed: (key?: (keyof T & string) | undefined) => Promise<void>;
    };
};
export {};
