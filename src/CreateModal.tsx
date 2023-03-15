import {
  provide,
  ref,
  Transition,
  defineComponent,
  reactive,
  watch,
  computed,
  shallowReactive,
  proxyRefs,
  Teleport,
} from 'vue'
import type {
  UnwrapRef,
  TransitionProps,
  Component,
  InjectionKey,
  Ref,
} from 'vue'
import { useRoute } from 'vue-router'
import { mergeDeepRight, mergeRight } from 'ramda'
import mitt, { Emitter, Handler } from 'mitt'
import { callHook } from './utils'

export interface EventMap {
  [x: string]: Handler
}

export type MaybeRefOpions<T> = {
  [P in keyof T]?: T[P] | Ref<T[P]>
}

export interface OpenOptions<C> {
  props?: C extends Component<infer P>
    ? P extends { $props: infer Props }
      ? MaybeRefOpions<Omit<Props, 'modelValue'>>
      : object
    : object
  on?: EventMap
  zIndex?: number
}
interface ModalObj {
  component: any
  zIndex?: number
  isOpened?: boolean
  key?: string
  props?: Record<string, any>
  on?: EventMap
}
interface ModalMap {
  [index: string]: Pick<ModalObj, 'component' | 'zIndex' | 'on' | 'props'>
}

type Listener = (...args: any[]) => any

type CreateReturn = ReturnType<typeof createVfModal> //Pick<, K>
export type Controller = Pick<CreateReturn, 'Controller'> extends {
  [x: string]: infer U
}
  ? U
  : never
export type VfModal = Pick<CreateReturn, 'VfModal'> extends {
  [x: string]: infer U
}
  ? U
  : never

interface CreateConfig<T extends ModalMap> {
  modals: T
  provide?: () => void
  mask?: {
    clickHandler?: (
      controller: {
        open: (key: string, config: Record<string, any>) => void
        close: (key?: string) => void
        isClosed: () => Promise<void>
      },
      emiiter: Emitter,
      instance: VfModal
    ) => void
    autoCloseModal?: boolean
    classname?: string
  }
  transition?: {
    name: string
    type: TransitionProps['type']
  }
  on?: {
    modalOpen?: Listener
    modalClose?: Listener
  }
  multipleModal?: boolean
  closeWhenRouteChanges?: boolean
  fixWrapperClassname?: string
  container?: string | Component
}

const defaultCreateConfig: Omit<CreateConfig<never>, 'modals'> = {
  transition: {
    name: 'vf-modal-fade',
    type: 'transition',
  },
  mask: {
    autoCloseModal: false,
    classname: 'vf-modal-mask-wrapper',
  },
  on: {},
  closeWhenRouteChanges: true,
  container: 'div',
}

interface VfModalInstanceState {
  renderList: RenderList
  close: (
    key?: string,
    opt?: { closeModal?: boolean; multiKey?: string }
  ) => void
  emitter: Emitter
}

type RenderItemOptTemp = Required<Omit<ModalObj, 'component'>>
interface RenderItemOpt extends RenderItemOptTemp {
  multiKey?: string
}

type RenderList = UnwrapRef<RenderItemOpt[]>

export const VfMODAL_STORE_KEY: InjectionKey<VfModalInstanceState> =
  Symbol('VF_MODAL_STORE_KEY')

export const createVfModal = <T extends ModalMap>(config: CreateConfig<T>) => {
  type ModalKey = keyof T & string

  const { modals } = config
  const {
    provide: customProvide,
    transition,
    mask,
    on,
    multipleModal,
    closeWhenRouteChanges,
    fixWrapperClassname,
    container,
  } = mergeDeepRight(defaultCreateConfig, config)
  const renderList: RenderList = reactive([])

  /**
   * visible of modal instance
   */
  const visible = ref(false)

  /**
   * handler visible on Transition component enter
   */
  const handlerOnAfterEnter = () => {
    visible.value = true
    callHook(on?.modalOpen)
  }

  /**
   * handler visible on Transition component leave
   */
  const handlerOnAfterLeave = () => {
    visible.value = false
    callHook(on?.modalClose)
  }

  /**
   * change this value to control modal opened/closed
   */
  const isModalOpened = ref(false)

  const emitter = mitt()

  /**
   * open a modal with key
   */
  const open = <K extends ModalKey>(
    key: K,
    opt?: OpenOptions<T[K]['component']>
  ) => {
    if (!modals[key]) {
      throw new Error(`can not find the modal by key: ${key}`)
    }

    const { zIndex, props, on } = mergeRight(
      {
        zIndex: modals[key].zIndex || 1,
        props: modals[key].props || {},
        on: modals[key].on || {},
      },
      opt || {}
    )

    isModalOpened.value = true

    const item = shallowReactive({ isOpened: true, zIndex, key, props, on })
    let multiKey: string

    if (multipleModal) {
      multiKey = key + renderList.length
      renderList.push({
        ...item,
        multiKey,
        props: { ...props, multiKey },
      })
    } else {
      const target = renderList.find((el) => el.key === key)
      if (target) {
        target.isOpened = true
        // update props and listeners
        target.props = props
        target.zIndex = zIndex
        target.on = on //markRaw(on)
      } else {
        renderList.push(item)
      }
    }

    return {
      renderList,
      isClosed: () =>
        new Promise<void>((resolve) => {
          if (!item.isOpened) {
            resolve()
            return
          }
          const unWatch = watch(
            [() => item.isOpened, () => renderList.length] as const,
            ([value, len]) => {
              if (!value || len === 0) {
                resolve()
                unWatch()
              }
            },
            { immediate: true }
          )
        }),
      close: () => {
        close(key, { multiKey, closeModal: false })
      },
    }
  }

  /**
   * close a modal
   * @param key modal key
   */
  const close = (
    key?: ModalKey,
    opt?: { closeModal?: boolean; multiKey?: string }
  ) => {
    const { closeModal, multiKey } = opt || { closeModal: true }
    if (key) {
      const k = multiKey || key
      const _k = multiKey ? 'multiKey' : 'key'
      renderList
        .filter((el) => el[_k] === k && el.isOpened)
        .forEach((e) => (e.isOpened = false))
    }
    if (
      !key ||
      closeModal ||
      renderList.filter((el) => el.isOpened).length === 0
    ) {
      // clear renderlist
      while (renderList.length > 0) renderList.pop()
      isModalOpened.value = false
    }
  }

  /**
   * returns a promise that will be resolved when the modal is closed
   */
  const isClosed = () =>
    new Promise<void>((resolve, reject) => {
      if (!visible.value) {
        resolve()
        return
      }

      // worry about memory leaks
      const unWatch = watch(visible, () => {
        if (!visible.value) {
          unWatch()
          resolve()
        }
      })
    })

  const VfModal = defineComponent({
    name: 'vf-modal-instance',
    setup() {
      // close modal when route change
      if (closeWhenRouteChanges) {
        const routerLink = useRoute()
        if (routerLink) {
          watch(
            () => routerLink.path,
            () => {
              if (isModalOpened.value) {
                close()
              }
            }
          )
        }
      }

      // use custom provide function
      if (customProvide) customProvide()

      // provie base state
      provide(VfMODAL_STORE_KEY, {
        renderList,
        close,
        emitter,
      })

      const rlist = computed(() => {
        return renderList
          .filter((el) => el.isOpened)
          .map((el) => {
            const { key, props, multiKey, on } = el

            const component = modals[key].component

            const handlerClose = (closeModal = true) => {
              close(key, { closeModal })
            }

            return (
              <component
                {...proxyRefs(props)}
                onClose={handlerClose}
                on={on}
                name={key}
                key={multiKey}
                style={{ zIndex: el.zIndex }}
              ></component>
            )
          })
      })

      const handleClickmask = () => {
        renderList
        if (mask?.autoCloseModal) {
          close()
        } else if (mask?.clickHandler) {
          mask.clickHandler(Controller, emitter, VfModal)
        }
      }

      return () => (
        <Teleport to="body">
          <Transition
            name={transition!.name}
            type={transition!.type}
            onAfterEnter={handlerOnAfterEnter}
            onAfterLeave={handlerOnAfterLeave}
          >
            <div
              class={fixWrapperClassname || 'vf-modal-fixed-wrapper'}
              v-show={isModalOpened.value}
            >
              <container
                style={{ zIndex: 1 }}
                class="vf-modal-container-wrapper"
              >
                {rlist.value}
              </container>
              <div
                style={{ zIndex: 0 }}
                onClick={handleClickmask}
                class={mask?.classname}
              ></div>
            </div>
          </Transition>
        </Teleport>
      )
    },
  })

  const Controller = {
    open,
    close,
    isClosed,
  }

  return {
    VfModal,
    Controller,
    emitter,
  }
}
