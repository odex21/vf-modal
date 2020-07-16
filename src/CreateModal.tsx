import { provide, UnwrapRef, Ref, ref, Transition, ComponentPublicInstance, defineComponent, ComponentCustomOptions, ComponentOptions, TransitionProps, reactive, watch, watchEffect, toRaw, shallowReactive, shallowRef, render, computed, InjectionKey, markRaw } from 'vue'
import { merge, mergeDeepLeft, mergeDeepRight } from 'ramda'

interface ModalObj {
  component: any
  zIndex?: number
  isOpened?: boolean
  _key?: string
}
interface ModalMap {
  [ index: string ]: Omit<ModalObj, '_key'>
}

type Listener = (...args: any[]) => any

interface CreateConfig {
  modals: ModalMap
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
    modalOpen: Listener
    [ x: string ]: Listener
  }
  multipleModal?: boolean
}

const defaultCreateConfig: CreateConfig = {
  modals: {},
  transition: {
    name: 'fade',
    type: 'animation'
  },
  maskWrapper: {
    clickHandler: () => { },
    classname: 'mask-wrapper'
  },
  on: {
    modalOpen: () => { }
  }
}

interface VfModalInstanceState {
  renderList: UnwrapRef<Required<ModalObj>[]>
  close: (key?: string | number | undefined) => void
}

export const VfMODAL_STORE_KEY: InjectionKey<VfModalInstanceState> = Symbol('VF_MODAL_STORE_KEY')

export const createVfModal = (config: CreateConfig) => {
  const { modals, provide: customProvide, transition, maskWrapper, on, multipleModal } = mergeDeepRight(defaultCreateConfig, config)
  const renderList: UnwrapRef<Required<Omit<ModalObj, 'component'>>[]> = reactive([])

  /**
   * visible of modal instance 
   */
  const visible = ref(false)

  const isClosed = ref(false)
  watchEffect(() => {
    if (isClosed.value) {
      visible.value = false
    }
  })


  /**
   * open a modal by key
   */
  const open = (key: keyof typeof modals & string, zIndex = 1) => {

    visible.value = true
    isClosed.value = false
    if (multipleModal) {
      renderList.push({ isOpened: true, zIndex, _key: key })
    } else {
      const target = renderList.find(el => el._key === key)
      if (target) {
        target.isOpened = true
      } else {
        renderList.push({ isOpened: true, zIndex, _key: key })
      }
    }
  }

  const close = (key?: keyof typeof modals, closeModal = true) => {
    if (key) {
      const target = renderList.find(el => el._key === key && el.isOpened)
      if (target) {
        target.isOpened = false
      }
    }
    if (!key || closeModal) {
      isClosed.value = true
    }
  }
  const closed = new Promise<void>((resolve, reject) => {
    watchEffect(() => {
      if (isClosed.value) {
        resolve()
      }
    })
  })


  const VfModal = defineComponent({
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
          const { _key } = el
          const component = modals[ _key ].component
          let { zIndex } = el
          if (zIndex !== undefined) {
            zIndex = 1
          }

          const handlerClose = (closeModal = true) => {
            close(_key, closeModal)
          }

          return <component onClose={handlerClose} name={_key} style={{ zIndex }}></component>
        })

      })

      // const zIndex = 0

      return () => (
        <Transition name={transition!.name} type={transition!.type} onAfterEnter={on!.modalOpen}>
          <div
            class="fixed-wrapper"
            v-show={visible.value}
          >
            <div
              style={{ zIndex: 1 }}
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
    closed
  }

  return {
    VfModal,
    Controller
  }
}