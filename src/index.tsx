import './styles/index.styl'

import Vue, { createVNode, Transition, Ref, ref, ComponentOptions, defineComponent, ComponentInternalInstance, Component, ComponentPublicInstance, onMounted, createApp, watchEffect, BaseTransition, toRefs, ComponentOptionsWithObjectProps } from 'vue'
import { prevent, generateClass, findKey, hyphenate } from './utils'
import { filter, merge } from 'ramda'
import * as CSS from 'csstype'
import { ComponentProps } from './props'


export type ComponentOption = Parameters<typeof defineComponent>[ 0 ]

export type Listener<T> = (instance: ComponentPublicInstance<T>, type: CloseType, ...args: any[]) => any
export interface ListenerGroup<T> {
  [ key: string ]: Listener<T>
}

export interface RunListenerGroup<T> {
  [ key: string ]: {
    name: string
    fn: Listener<T>
  } | Listener<T>
}
type ComponentConstructor = ComponentOption | ReturnType<typeof defineComponent>
export interface ModalComponent {

  component: ComponentConstructor | 'div'
  defaultProps?: ComponentProps<any> //Record<string, any>
  slot?: string
  on?: ListenerGroup<ComponentPublicInstance<any>>
  className?: string
  ref?: string
  closeButton?: boolean
}
type ArrayItem<T> = T extends Array<infer U> ? U : never
export interface ModalTypesGroup {
  [ key: string ]: ModalComponent
}


interface BaseConfig {
  awaitClose?: boolean
  containerStyle?: CSS.Properties
  containerClass?: string
  maskClosable?: boolean
}

export interface ModalRunConfig<T, K> extends BaseConfig {
  type: T & string,
  onClose?: (instance: ComponentPublicInstance<K>, type: CloseType, ...args: any[]) => any
  on?: RunListenerGroup<K>
  props?: ComponentProps<K>
}

export interface CreateConfig<T extends (ComponentConstructor | 'div') = 'div'> extends BaseConfig {
  container?: T
  transitionName?: string
  closeButtonClass?: string
  maskWrapperClass?: string
  conatainerProps?: T extends ComponentConstructor ? ComponentProps<T> : never
}

export type CloseType = 'close' | 'custom' | 'instance' | string & {}

// export type ModalIntance = InstanceType<typeof >
export interface baseResolve {
  instance: any
  type: CloseType
  closed: Promise<void>
  close: () => void
}

const defaultBaseConfig: CreateConfig = {
  container: 'div',
  containerClass: 'dialog-wrapper',
  maskWrapperClass: 'mask-wrapper',
  transitionName: 'fade',
  containerStyle: {
    zIndex: 999
  },
  closeButtonClass: 'close-btn'
}


const defaultRunConfig = {
  awaitClose: true
}

const VfComponent = defineComponent({
  name: 'base',
  setup () {
    const visible = ref(true)
  },
  data () {
    return {
      visible: true,
      id: '',
      closed: false,
      onClose: <T extends object> (instance: T, type: CloseType, ...args: any[]) => { }
    }
  },

  methods: {
    /**
     * close modal
     */
    close (type: CloseType, ...args: any[]) {
      this.closed = true
      if (this.onClose && typeof this.onClose === 'function') {
        this.onClose(this, type, ...args)
      }
    },
    handleAfterLeave () {
      // this.$destroy()
      if (this.$el && this.$el.parentNode)
        this.$el.parentNode.removeChild(this.$el)
    }
  },
})

const zIndex = 0

const createVfModal = <T extends ModalTypesGroup> (modalTypesGroup: T, createConfig?: CreateConfig) =>
  <Key extends keyof T, TargetComponent = T[ Key ]> (config: ModalRunConfig<Key, TargetComponent>, props?: ComponentProps<TargetComponent>, c?: TargetComponent): baseResolve => {
    let d = {} as TargetComponent

    const {
      type,
      awaitClose,
      containerStyle: runContainerStyle = {},
      maskClosable: runMaskClosalbe,
      containerClass: runContainerClass
    } = merge(defaultRunConfig, config)


    const onClose = config.onClose

    const targetComponent = modalTypesGroup[ type ]
    if (!targetComponent) throw Error(`not has modal of this type, ${type}`)

    const isClosed = ref(false)
    const modalInstance: Ref<ComponentPublicInstance<TargetComponent> | null> = ref(null)

    const close = () => {
      isClosed.value = true
    }
    const visible = ref(true)

    watchEffect(() => {
      if (isClosed.value) {
        visible.value = false
      }
    })

    const closed = new Promise<void>((resolve, reject) => {
      watchEffect(() => {
        if (isClosed.value) {
          resolve()
        }
      })
    })

    let _app: ComponentPublicInstance<TargetComponent>

    const App = defineComponent({
      props: {
        msg: String
      },
      mounted () {
        _app = (this as any)
      },
      setup () {

        return () => {

          const customNode = [ targetComponent ].map(el => {
            const { component, on: elOn, slot, className } = el
            const { on: runOn } = config
            const on = runOn ? merge(elOn || {}, runOn) : elOn

            const defaultL = {
              // 监听组件中调用的`close`事件，关闭modal
              // close: (type: CloseType, ...args: any[]) => this.close(type, ...args),
            }

            // 传入instance
            const l = on ? Object.keys(on).reduce((res, cur) => {
              const listener = on[ cur ]
              if (typeof listener === 'function') {
                res[ cur ] = (type: CloseType, ...args: any[]) => {
                  listener(_app, type, ...args)
                }
              } else if ((component !== 'div' && component.name === listener.name) || component === 'div' && listener.name === className) {
                res[ cur ] = (type: CloseType, ...args: any[]) => {
                  listener.fn(_app, type, ...args)
                }
              }
              return res
              // todo fix type
            }, {} as any) : {}
            const ll = merge(defaultL, l)

            const attrs = merge(el.defaultProps || {}, props || {})

            return (
              <component
                {...{ attrs, }}
                style={runContainerStyle}
                ref={modalInstance}
                on={ll}
                class={className}
              >{slot}</component>
            )
          })

          const {
            container,
            containerClass,
            conatainerProps: baseAttrs,
            transitionName,
            containerStyle,
            closeButtonClass,
            maskClosable,
            maskWrapperClass,
          } = merge(defaultBaseConfig, createConfig || {})

          const defaultNode = []
          if (targetComponent.closeButton) {
            defaultNode.push(<div ref="closeButton" style={{ zIndex: zIndex + 2 }} class={closeButtonClass} onClick={close}></div>)
          }


          const maskClickHandler = () => {
            if (runMaskClosalbe || maskClosable) {
              close()
            }
          }

          const containerClassList: string[] = [ hyphenate(type) ]
          if (containerClass) containerClassList.push(containerClass)
          if (runContainerClass) containerClassList.push(runContainerClass)

          const onEnter = () => {
            console.log("I'm enter")
          }

          return (
            <Transition name={transitionName} type="animation" onAfterEnter={onEnter}>
              <div
                v-show={visible.value}
                class="fixed-wrapper"
                onTouchmove={prevent}
                {...{ attrs: baseAttrs }}
                style={containerStyle as any || ''}
              >
                <div ref='body' style={{ zIndex: zIndex + 1 }} class={generateClass(containerClassList)}>
                  {defaultNode}
                  {customNode}
                </div>

                <div style={{ zIndex }} onClick={maskClickHandler} class={maskWrapperClass}></div>
              </div>
            </Transition>
          )
        }
      },
    })

    if (!modalContainerElem) {
      modalContainerElem = document.createElement('div')
      modalContainerElem.id = 'vf-modal-container'
      document.body.appendChild(modalContainerElem)
    }
    const app = createApp(App)
    app.mount('#vf-modal-container')

    return { instance: modalInstance.value, type: 'instance', close, closed }
  }

let modalContainerElem: HTMLElement

export { createVfModal }


const ApiError: ComponentOption = {
  props: {
    msg: {
      default: 'hello',
      required: true,
      type: String
    },
    no: {
      default: 1,
      required: true,
      type: Number
    }
  },
  setup (props, { attrs }) {
    const { msg } = toRefs(props)
    return <>
      <p>Api Error</p>
      <p> msg:{msg.value}</p>
    </>
  }
}

export const vf = createVfModal({
  test: {
    component: ApiError,
    closeButton: true
  }
})

vf({
  type: 'test',
})

let d: ComponentOption 