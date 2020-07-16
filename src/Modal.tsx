import { UnwrapRef, Ref, ref, Transition, ComponentPublicInstance, defineComponent, ComponentCustomOptions, ComponentOptions, TransitionProps, reactive, watch, watchEffect, toRaw, shallowReactive, shallowRef } from 'vue'
import { memoizeWith, identity } from 'ramda'


interface ModalMap {
  [ index: string ]: any
}



class _VFModal<T extends ModalMap> {
  instance!: any //ComponentPublicInstance
  modals: UnwrapRef<T>
  renderList: Ref<ComponentOptions[]> = shallowRef([])
  maskWrapperClass: string = 'mask-wrapper'
  maskClickHandler: (...args: any[]) => any = () => {
    console.log('click mask')
  }
  provideFunc: () => void

  open: (key: keyof T & string) => void

  constructor (modals: ModalMap, provide: () => void) {
    this.modals = shallowReactive(modals) as any
    this.provideFunc = provide
    this.open = (key: keyof T & string) => {
      const c = this.modals[ key ]
      console.log(c, key)
      this.renderList.value.push(c)
    }

    this.initInstance()
  }


  private initInstance () {
    const modals = this.modals
    const renderList = this.renderList
    const maskClickHandler = this.maskClickHandler
    const maskWrapperClass = this.maskWrapperClass
    const provideFunc = this.provideFunc

    this.instance = defineComponent({
      props: {
        msg: {
          default: 'abc',
          type: String
        }
      },
      setup () {
        const transition = {
          name: 'fade',
          type: 'animation'
        } as Pick<TransitionProps, 'name' | 'type'>
        const onEnter = () => { }
        const visible = ref(true)
        const zIndex = 0

        // provide
        provideFunc()

        // console.log('render', renderList, renderList.value.length)
        // console.log('modals', modals)

        const rlist: any[] = []
        // update modal list
        watchEffect(() => {
          renderList.value.forEach(el => rlist.push(<el></el>))
        })

        return () => (
          <Transition name={transition.name} type={transition.type} onAfterEnter={onEnter}>
            <div
              class="fixed-wrapper"
              v-show={visible.value}
            >
              <div
                style={{ zIndex: zIndex + 1 }}
              >
                <p>123456</p>
                {rlist}
                {rlist.length}
              </div>
              <div style={{ zIndex }} onClick={maskClickHandler} class={maskWrapperClass}></div>
            </div>
          </Transition>
        )
      }
    })
  }
}

interface VFModal {
  new <T extends ModalMap>(modals: T, provide: () => void): _VFModal<T>
}

export const VFModal: VFModal = _VFModal
