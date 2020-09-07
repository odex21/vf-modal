import { provide, UnwrapRef, ref, Transition, defineComponent, TransitionProps, reactive, watch, computed, InjectionKey, Component } from 'vue'
import { useRoute } from "vue-router"
import { mergeDeepRight } from 'ramda'
import mitt, { Emitter } from 'mitt'

interface ModalObj {
  component: any
  zIndex?: number
  isOpened?: boolean
  key?: string
  props?: Record<string, any>
}
interface ModalMap {
  [ index: string ]: Omit<ModalObj, 'key' | 'props'>
}

type Listener = (...args: any[]) => any

interface CreateConfig<T extends ModalMap> {
  modals: T
  provide?: () => void
  maskWrapper?: {
    clickHandler?: Listener
    classname: string
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
    classname: 'vf-modal-mask-wrapper'
  },
  on: {
  },
  closeWhenRouteChanges: true,
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
   * @param key {ModalKey}
   * @param props {Record<string, any>}
   * @param zIndex {number}
   */
  const open = (key: ModalKey, props: Record<string, any> = {}, zIndex = 1) => {
    if (!key || typeof key !== 'string') {
      throw new Error('must have a key')
    }

    isModalOpened.value = true

    const item = { isOpened: true, zIndex, key, props, }
    let mutiKey: string

    if (multipleModal) {
      mutiKey = key + renderList.length
      renderList.push({ ...item, mutiKey })
    } else {
      const target = renderList.find(el => el.key === key)
      if (target) {
        target.isOpened = true
      } else {
        renderList.push(item)
      }
    }

    return {
      emitter,
      isClosed: () => new Promise((resolve) => {
        const unWatch = watch(() => item.isOpened, (value) => {
          if (!value) {
            unWatch()
            resolve()
          }
        })
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
      const target = renderList.find(el => el[ _k ] === k && el.isOpened)
      if (target) {
        target.isOpened = false
      }
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
  const isClosed = (key?: ModalKey) => new Promise<void>((resolve, reject) => {
    const unWatch = watch(visible, () => {
      if (!visible.value) {
        if (key) {
          const target = renderList.find(el => el.key === key)
          // not target modal closed
          if (target?.isOpened) {
            return
          }
        }
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
          const { key, props, mutiKey } = el

          if (!modals[ key ]) {
            throw new Error(`can not find the modal by key: ${key}`)
          }
          const component = modals[ key ].component


          if (el.zIndex !== undefined) {
            el.zIndex = 1
          }

          const handlerClose = (closeModal = true) => {
            close(key, { closeModal })
          }

          return <component {...props} onClose={handlerClose} name={key} key={mutiKey} style={{ zIndex: el.zIndex }}></component>
        })

      })

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
            <div style={{ zIndex: 0 }} onClick={maskWrapper?.clickHandler} class={maskWrapper?.classname}></div>
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
    Controller
  }
}