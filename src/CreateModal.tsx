import { provide, UnwrapRef, ref, Transition, defineComponent, TransitionProps, reactive, watch, computed, InjectionKey, Component, markRaw, shallowReactive } from 'vue'
import { useRoute } from "vue-router"
import { mergeDeepRight, mergeRight } from 'ramda'
import mitt, { Emitter, Handler } from 'mitt'

export interface EventMap {
  [ x: string ]: Handler
}

export interface OpenOptions {
  props?: Record<string, any>
  on?: EventMap
  zIndex?: number
}
interface ModalObj {
  component: any
  zIndex?: number
  isOpened?: boolean
  key?: string
  props?: Record<string, any>,
  on?: EventMap
}
interface ModalMap {
  [ index: string ]: Omit<ModalObj, 'key' | 'on' | 'props'>
}

type Listener = (...args: any[]) => any

type CreateReturn = ReturnType<typeof createVfModal>//Pick<, K>
type Controller = Pick<CreateReturn, 'Controller'> extends { [ x: string ]: infer U } ? U : never
type VfModal = Pick<CreateReturn, 'VfModal'> extends { [ x: string ]: infer U } ? U : never

interface CreateConfig<T extends ModalMap> {
  modals: T
  provide?: () => void
  maskWrapper?: {
    clickHandler?: (controller: Controller, emiiter: Emitter, instance: VfModal) => void
    autoCloseModal?: boolean
    classname?: string
  }
  transition?: {
    name: string
    type: TransitionProps[ 'type' ]
  }
  on?: {
    modalOpen?: Listener
    modalClose?: Listener
  }
  multipleModal?: boolean
  closeWhenRouteChanges?: boolean,
  fixWrapperClassname?: string
  container?: string | Component
}

const defaultCreateConfig: Omit<CreateConfig<never>, 'modals'> = {
  transition: {
    name: 'vf-modal-fade',
    type: 'animation'
  },
  maskWrapper: {
    clickHandler: () => { },
    autoCloseModal: false,
    classname: 'vf-modal-mask-wrapper'
  },
  on: {
  },
  closeWhenRouteChanges: false,
  container: 'div'
}

interface VfModalInstanceState {
  renderList: RenderList
  close: (key?: string) => void
  emitter: Emitter
}

type RenderItemOptTemp = Required<Omit<ModalObj, 'component'>>
interface RenderItemOpt extends RenderItemOptTemp {
  mutiKey?: string
}

type RenderList = UnwrapRef<RenderItemOpt[]>
// type RenderItem = RenderList extends (infer T)[] ? T : never

export const VfMODAL_STORE_KEY: InjectionKey<VfModalInstanceState> = Symbol('VF_MODAL_STORE_KEY')

export const createVfModal = <T extends ModalMap> (config: CreateConfig<T>) => {
  type ModalKey = (keyof T) & string

  const { modals } = config
  const { provide: customProvide, transition, maskWrapper, on, multipleModal, closeWhenRouteChanges, fixWrapperClassname, container } = mergeDeepRight(defaultCreateConfig, config)
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
    if (on!.modalOpen) on!.modalOpen()
  }

  /**
    * handler visible on Transition component leave
  */
  const handlerOnAfterLeave = () => {
    visible.value = false
    if (on!.modalClose) on!.modalClose()
  }

  /**
   * change this value to control modal opened/closed
   */
  const isModalOpened = ref(false)


  const emitter = mitt()

  /**
   * open a modal with key
   */
  const open = (key: ModalKey, opt?: OpenOptions) => {

    if (!modals[ key ]) {
      throw new Error(`can not find the modal by key: ${key}`)
    }

    const { zIndex, props, on } = mergeRight({ zIndex: 1, props: {}, on: {} }, opt || {})

    isModalOpened.value = true

    const item = shallowReactive({ isOpened: true, zIndex, key, props, on })
    let mutiKey: string

    if (multipleModal) {
      mutiKey = key + renderList.length
      renderList.push({ ...item, mutiKey })
    } else {
      const target = renderList.find(el => el.key === key)
      if (target) {
        target.isOpened = true
        // update props and listeners
        target.props = props
        target.on = on//markRaw(on)
      } else {
        renderList.push(item)
      }
    }

    return {
      renderList,
      isClosed: () => new Promise<void>((resolve) => {
        if (!item.isOpened) {
          resolve()
          return
        }
        const unWatch = watch(() => item.isOpened, (value) => {
          if (!value) {
            resolve()
            unWatch()
          }
        }, { immediate: true })
      }),
      close: () => {
        close(key, { mutiKey, closeModal: false })
      }
    }
  }

  /**
   * close a modal
   * @param key modal key
   */
  const close = (key?: ModalKey, opt?: { closeModal?: boolean, mutiKey?: string }) => {
    const { closeModal, mutiKey } = opt || { closeModal: true }
    if (key) {
      const k = mutiKey || key
      const _k = mutiKey ? 'mutiKey' : 'key'
      renderList.filter(el => el[ _k ] === k && el.isOpened).forEach(e => e.isOpened = false)
    }
    if (!key || closeModal || renderList.filter(el => el.isOpened).length === 0) {
      // clear renderlist
      while (renderList.length > 0) renderList.pop()
      isModalOpened.value = false
    }
  }

  /**
   * return a promise that resolve when modal close
   */
  const isClosed = () => new Promise<void>((resolve, reject) => {
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
    setup () {

      // close modal when route change
      if (closeWhenRouteChanges) {
        const routerLink = useRoute()
        if (routerLink) {
          watch(() => routerLink.path, () => {
            if (isModalOpened.value) {
              console.log('it should be close ')
              close()
            }
          })
        }
      }

      // use custom provide function
      if (customProvide) customProvide()

      // provie base state
      provide(VfMODAL_STORE_KEY, {
        renderList,
        close,
        emitter
      })

      const rlist = computed(() => {
        return renderList.filter(el => el.isOpened).map(el => {
          const { key, props, mutiKey, on } = el

          const component = modals[ key ].component

          if (el.zIndex !== undefined) {
            el.zIndex = 1
          }

          const handlerClose = (closeModal = true) => {
            close(key, { closeModal })
          }

          return <component {...props} onClose={handlerClose} on={on} name={key} key={mutiKey} style={{ zIndex: el.zIndex }}></component>
        })

      })

      const handleClickMaskWrapper = () => {
        if (maskWrapper?.autoCloseModal) {
          close()
        } else if (maskWrapper?.clickHandler) {
          maskWrapper.clickHandler(Controller, emitter, VfModal)
        }
      }

      return () => (
        <Transition name={transition!.name} type={transition!.type} onAfterEnter={handlerOnAfterEnter} onAfterLeave={handlerOnAfterLeave}>
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
              onClick={handleClickMaskWrapper}
              class={maskWrapper?.classname}>
            </div>
          </div>
        </Transition>
      )

    }
  })

  const Controller = {
    open,
    close,
    isClosed
  }

  return {
    VfModal,
    Controller,
    emitter,
  }
}