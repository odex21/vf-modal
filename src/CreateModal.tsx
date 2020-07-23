import { provide, UnwrapRef, ref, Transition, defineComponent, TransitionProps, reactive, watch, computed, InjectionKey } from 'vue'
import { merge, mergeDeepLeft, mergeDeepRight } from 'ramda'

interface ModalObj {
  component: any
  zIndex?: number
  isOpened?: boolean
  key?: string
}
interface ModalMap {
  [ index: string ]: Omit<ModalObj, 'key'>
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
  }
}

interface VfModalInstanceState {
  renderList: RenderList
  close: (key?: string | number | undefined) => void
}

type RenderList = UnwrapRef<Required<Omit<ModalObj, 'component'>>[]>

export const VfMODAL_STORE_KEY: InjectionKey<VfModalInstanceState> = Symbol('VF_MODAL_STORE_KEY')

export const createVfModal = <T extends ModalMap> (config: CreateConfig<T>) => {
  const { modals } = config
  const { provide: customProvide, transition, maskWrapper, on, multipleModal } = mergeDeepRight(defaultCreateConfig, config)
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
   * open a modal by key
   */
  const open = (key: (keyof T) & string, zIndex = 1) => {

    isModalOpened.value = true

    if (multipleModal) {
      renderList.push({ isOpened: true, zIndex, key })
    } else {
      const target = renderList.find(el => el.key === key)
      if (target) {
        target.isOpened = true
      } else {
        renderList.push({ isOpened: true, zIndex, key })
      }
    }
  }

  const close = (key?: keyof typeof modals, closeModal = true) => {
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

  const isClosed = () => new Promise<void>((resolve, reject) => {
    watch(visible, () => {
      if (visible.value) {
        resolve()
      }
    })
  })


  const VfModal = defineComponent({
    name: 'vf-modal-instance',
    setup () {

      // use custom provide function
      if (customProvide) customProvide()

      // provie base state
      provide(VfMODAL_STORE_KEY, {
        renderList,
        close
      })

      const rlist = computed(() => {
        return renderList.filter(el => el.isOpened).map(el => {
          const { key } = el
          const component = modals[ key ].component
          let { zIndex } = el
          if (zIndex !== undefined) {
            zIndex = 1
          }

          const handlerClose = (closeModal = true) => {
            close(key, closeModal)
          }

          return <component onClose={handlerClose} name={key} style={{ zIndex }}></component>
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
            <div style={{ zIndex: 0 }} onClick={maskWrapper!.clickHandler} class={maskWrapper!.classname}></div>
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