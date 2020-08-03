import './styles/index.styl'

import Vue from 'vue'
import { prevent, generateClass, findKey, hyphenate } from './utils'
import { filter, merge } from 'ramda'
import { VueConstructor } from 'vue/types/vue'
import { ComponentOptions } from 'vue/types/options'
import * as CSS from 'csstype'

export type Listener<T> = (instance: T, type: CloseType, ...args: any[]) => any
export interface ListenerGroup<T> {
  [ key: string ]: Listener<T>
}

export interface RunListenerGroup<T> {
  [ key: string ]: {
    name: string
    fn: Listener<T>
  } | Listener<T>
}

export interface ModalComponent<T> {
  component: VueConstructor | ComponentOptions<Vue> | 'div'
  defaultProps?: Record<string, any>
  slot?: string
  on?: ListenerGroup<T>
  className?: string
  ref?: string
}

export type ModalItemGroup<T> = (ModalComponent<T> | string)[]
export interface ModalTypesGroup<T> {
  [ key: string ]: ModalItemGroup<T>
}


interface BaseConfig {
  awaitClose?: boolean
  containerStyle?: CSS.Properties
  containerClass?: string
  maskClosable?: boolean
}

export interface ModalRunConfig<T, K> extends BaseConfig {
  type: T & string,
  onClose?: (instance: K, type: CloseType) => any
  on?: RunListenerGroup<K>
  props?: {
    [ key: string ]: any
  }
}

export interface CreateConfig extends BaseConfig {
  container?: VueConstructor | 'div'
  transitionName?: string
  closeButtonClass?: string
  maskWrapperClass?: string
  conatainerProps?: {
    [ key: string ]: any
  }
}

export type CloseType = 'close' | 'custom' | 'instance' | string & {}

export type ModalIntance = InstanceType<typeof Component>
export interface baseResolve {
  instance: ModalIntance
  type: CloseType
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

const Component = Vue.extend({
  name: 'abc',
  data () {
    return {
      visible: true,
      id: '',
      closed: false,
      onClose: <T extends object> (instance: T, type: CloseType, ...args: any[]) => { }
    }
  },
  watch: {
    closed (newVal: boolean) {
      if (newVal) {
        this.visible = false
      }
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
      this.$destroy()
      if (this.$el && this.$el.parentNode)
        this.$el.parentNode.removeChild(this.$el)
    }
  },
})

const zIndex = 0

const createVfModal = <T extends ModalTypesGroup<ModalIntance>> (modalTypesGroup: T, createConfig?: CreateConfig) =>
  (config: ModalRunConfig<keyof T, ModalIntance>): Promise<baseResolve> => {
    return new Promise((resolve, reject) => {

      const {
        type,
        props = {},
        awaitClose,
        containerStyle: runContainerStyle = {},
        maskClosable: runMaskClosalbe,
        containerClass: runContainerClass
      } = merge(defaultRunConfig, config)


      const onClose = awaitClose ? (instance: ModalIntance, type: CloseType) => {
        resolve({ instance, type })
      } : config.onClose


      const customList = modalTypesGroup[ type ]
      if (!customList) throw Error(`not has modal of this type, ${type}`)

      const checkType = findKey(customList)

      const instance = new Component({
        data () {
          return {
            onClose
          }
        },
        render: function (h) {
          const temp = filter(e => !!(typeof e !== 'string' && e.component), customList) as ModalComponent<ModalIntance>[]

          const customNode = temp.map(el => {
            const { component, on: elOn, slot, className, ref } = el
            const { on: runOn } = config
            const on = runOn ? merge(elOn || {}, runOn) : elOn

            const defaultL = {
              // 监听组件中调用的`close`事件，关闭modal
              close: (type: CloseType, ...args: any[]) => this.close(type, ...args),
            }

            // 传入instance
            const l = on ? Object.keys(on).reduce((res, cur) => {
              const listener = on[ cur ]
              if (typeof listener === 'function') {
                res[ cur ] = (type: CloseType, ...args: any[]) => {
                  listener(this, type, ...args)
                }
              } else if ((component !== 'div' && component.name === listener.name) || component === 'div' && listener.name === className) {
                res[ cur ] = (type: CloseType, ...args: any[]) => {
                  listener.fn(this, type, ...args)
                }
              }
              return res
              // todo fix type
            }, {} as any) : {}
            const ll = merge(defaultL, l)

            const attrs = merge(el.defaultProps || {}, props)

            return (
              <component
                {...{ attrs, }}
                style={runContainerStyle}
                ref={ref}
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
            maskWrapperClass
          } = merge(defaultBaseConfig, createConfig || {})

          const defaultNode = []
          if (checkType('close')) {
            defaultNode.push(<div ref="closeButton" style={{ zIndex: zIndex + 2 }} class={closeButtonClass} onClick={() => this.close('close')}></div>)
          }


          const maskClickHandler = () => {
            if (runMaskClosalbe || maskClosable) {
              this.close('close')
            }
          }

          const containerClassList: string[] = [ hyphenate(type) ]
          if (containerClass) containerClassList.push(containerClass)
          if (runContainerClass) containerClassList.push(runContainerClass)


          return (
            <transition name={transitionName} onAfterLeave={this.handleAfterLeave}>
              <div
                v-show={this.visible}
                class="fixed-wrapper"
                onTouchmove={prevent}
                {...{ attrs: baseAttrs }}
                style={containerStyle}
              >
                <container ref='body' style={{ zIndex: zIndex + 1 }} class={generateClass(containerClassList)}>
                  {defaultNode}
                  {customNode}
                </container>

                <div style={{ zIndex }} onClick={maskClickHandler} class={maskWrapperClass}></div>
              </div>
            </transition >
          )
        }
      })
      instance.$mount()
      document.body.appendChild(instance.$el)

      if (!awaitClose) {
        resolve({ instance, type: 'instance' })
      }
    })
  }



export { createVfModal }
