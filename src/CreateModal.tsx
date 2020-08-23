import { provide, UnwrapRef, ref, Transition, defineComponent, TransitionProps, reactive, watch, computed, InjectionKey, shallowReactive } from 'vue'
import { useRoute } from "vue-router"
import { mergeDeepRight } from 'ramda'
import mitt, { Emitter } from 'mitt'

interface ModalObj {
  component: any
  zIndex?: number
  isOpened?: boolean
  key?: string
  emitter: Emitter
}
interface ModalMap {
  [ index: string ]: Omit<ModalObj, 'key' | 'emitter'>
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
  closeWhenRouteChanges?: boolean
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
  closeWhenRouteChanges: true
}

interface VfModalInstanceState {
  renderList: RenderList
  close: (key?: string | number | undefined) => void
}

type RenderList = UnwrapRef<Required<Omit<ModalObj, 'component'>>[]>
type RenderItem = RenderList extends (infer T)[] ? T : never

export const VfMODAL_STORE_KEY: InjectionKey<VfModalInstanceState> = Symbol('VF_MODAL_STORE_KEY')

export const createVfModal = <T extends ModalMap> (config: CreateConfig<T>) => {
  type ModalKey = (keyof T) & string

  const { modals } = config
  const { provide: customProvide, transition, maskWrapper, on, multipleModal, closeWhenRouteChanges } = mergeDeepRight(defaultCreateConfig, config)
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


  /**
   * open a modal with key
   * @return {Promise}  a promise that resolve when modal close
   */
  const open = (key: ModalKey, zIndex = 1) => {

    isModalOpened.value = true

    const emitter = mitt()
    const item = shallowReactive({ isOpened: true, zIndex, key, emitter })

    if (multipleModal) {
      renderList.push(item)
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
      })
    }
  }

  /**
   * close a modal
   * @param key modal key
   * @param {boolean} [closeModal = true] - option of close modal instance 
   */
  const close = (key?: ModalKey, closeModal = true) => {
    if (key) {
      const target = renderList.find(el => el.key === key && el.isOpened)
      if (target) {
        target.isOpened = false
      }
    }
    if (!key || closeModal) {
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
        close
      })

      const rlist = computed(() => {
        return renderList.filter(el => el.isOpened).map(el => {
          const { key, emitter } = el
          const component = modals[ key ].component
          let { zIndex } = el
          if (zIndex !== undefined) {
            zIndex = 1
          }

          const handlerClose = (closeModal = true) => {
            close(key, closeModal)
          }

          return <component emitter={emitter} onClose={handlerClose} name={key} style={{ zIndex }}></component>
        })

      })

      return () => (
        <Transition name={transition!.name} type={transition!.type} onAfterEnter={handlerOnAfterEnter} onAfterLeave={handlerOnAfterLeave}>
          <div
            class="vf-modal-fixed-wrapper"
            v-show={isModalOpened.value}
          >
            <div
              style={{ zIndex: 1 }}
              class="vf-modal-container-wrapper"
            >
              {rlist.value}
            </div>
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