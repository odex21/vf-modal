import './styles/index.styl'

import Vue from 'vue'
import { prevent, generateClass, findKey } from './utils'
import { filter, merge } from 'ramda'
import { VueConstructor } from 'vue/types/vue'
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
  component: VueConstructor | 'div'
  defaultProps?: Record<string, any>
  slot?: string
  on?: ListenerGroup<T>
  className?: string
}

export type ModalItemGroup<T> = (ModalComponent<T> | string)[]
export interface ModalTypesGroup<T> {
  [ key: string ]: ModalItemGroup<T>
}


export interface ModalRunConfig<T, K> {
  type: T & string,
  data?: {
    [ key: string ]: any
  },
  onClose?: (instance: K, type: CloseType) => any
  on?: RunListenerGroup<K>
  awaitClose?: boolean
  containerStyle?: CSS.Properties
  maskClosable?: boolean
  containerClass?: string
}

export interface BaseConfig {
  container?: VueConstructor | 'div'
  containerClass?: string
  data?: {
    [ key: string ]: any
  },
  awaitClose?: boolean
  containerStyle?: CSS.Properties
  transitionName?: string
  closeButtonClass?: string
  maskClosable?: boolean
}

export type CloseType = 'close' | 'custom' | 'instance'

export type ModalIntance = InstanceType<typeof Component>
export interface baseResolve {
  instance: ModalIntance
  type: CloseType
}

const defaultBaseConfig: BaseConfig = {
  container: 'div',
  containerClass: 'dialog-wrapper',
  data: {},
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



const createVfModal = <T extends ModalTypesGroup<ModalIntance>> (modalTypesGroup: T, baseConfig?: BaseConfig) =>
  (config: ModalRunConfig<keyof T, ModalIntance>): Promise<baseResolve> => {
    return new Promise((resolve, reject) => {

      const {
        type,
        data = { text: 'hi father', a: 's' },
        awaitClose,
        containerStyle: runContainerStyle = {},
        maskClosable: runMaskClosalbe,
        containerClass: runContainerClass
      } = merge(defaultRunConfig, config)


      const onClose = awaitClose ? (instance: ModalIntance, type: CloseType) => {
        resolve({ instance, type })
      } : config.onClose


      const customList = modalTypesGroup[ type ] || []

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
            const { component, on: elOn, slot, className } = el
            const { on: runOn } = config
            const on = runOn ? merge(elOn || {}, runOn) : elOn
            let listeners: ListenerGroup<ModalIntance>

            // if(component !== 'div' && component)
            const defaultL = {
              close: (type: CloseType = 'close', ...args: any[]) => this.close(type, ...args),
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
            }, Object.create({}) as any) : {}
            const ll = merge(defaultL, l)

            const attrs = merge(el.defaultProps || {}, data)

            return (
              <component
                {...{ attrs, }}
                on={ll}
                class={className}
              >{slot}</component>
            )
          })

          const { container, containerClass, data: baseAttrs, transitionName, containerStyle, closeButtonClass, maskClosable } = merge(defaultBaseConfig, baseConfig || {})


          const defaultNode = []
          if (checkType('close')) {
            defaultNode.push(<div class={closeButtonClass} onClick={() => this.close('close')}></div>)
          }


          const maskClickHandler = () => {
            if (runMaskClosalbe || maskClosable) {
              this.close('close')
            }
          }

          const containerClassList: string[] = [ type ]
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
                <container class={generateClass(containerClassList)}>
                  {defaultNode}
                  {customNode}
                </container>

                <div onClick={maskClickHandler} class="mask-wrapper"></div>
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
