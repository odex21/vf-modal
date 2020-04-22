import './styles/index.styl'

import Vue from 'vue'
import { prevent, generateClass, findKey } from './utils'
import { curry, filter, merge } from 'ramda'
import { VueConstructor } from 'vue/types/vue'

interface DiaglogKeyC {
  component?: VueConstructor
  title?: string,
  defaultData?: Record<string, any>
}

type DialogConfigKey = (DiaglogKeyC | string)[]
interface DialogTypesAGroup {
  [ key: string ]: DialogConfigKey
}


interface DialolgRunConfig<T> {
  transitionName: string
  type: T & string & number,
  data: {
    [ key: string ]: any
  }
}

interface BaseConfig {
  container?: VueConstructor | 'div'
  containerClass?: string
  data?: {
    [ key: string ]: any
  }
}

const defaultBaseConfig = {
  container: 'div',
  containerClass: 'dialog-wrapper',
  data: {}
}

const Component = Vue.extend({})

const dialog = <T extends DialogTypesAGroup> (dialogTypes: T, baseConfig: BaseConfig) => (config: DialolgRunConfig<keyof T>) => {
  const {
    transitionName = 'fade',
    type,
    data = { text: 'hi father', a: 's' }
  } = config || {}

  const customList = dialogTypes[ type ] || []

  const checkType = findKey(customList)

  const instance = new Component({
    props: {
      onClose: Function
    },
    data: {
      visible: true,
      closed: false,
      id: ''
    },
    watch: {
      closed (newVal: boolean) {
        if (newVal) {
          this.visible = false
        }
      }
    },

    methods: {
      close (ev: any) {
        this.closed = true
        if (this.onClose && typeof this.onClose === 'function') {
          this.onClose(this, ev)
        }
      },
      handleAfterLeave () {
        this.$destroy()
        if (this.$el && this.$el.parentNode)
          this.$el.parentNode.removeChild(this.$el)
      }
    },
    render: function (h) {
      const temp = filter(e => !!(typeof e !== 'string' && e.component), customList) as DiaglogKeyC[]

      const customNode = temp.map(el => {
        const component = el.component
        const attrs = merge(el.defaultData || {}, data)
        return (
          <component
            {...{ attrs }}
          ></component>
        )
      })

      const defaultNode = []
      if (checkType('close')) {
        defaultNode.push(<div class="close-btn" onClick={this.close}></div>)
      }

      const { title } = (customList.find(e => typeof e !== 'string' && e.title) || {}) as DiaglogKeyC
      if (title) {
        defaultNode.push(<div class="dialog-title">{title}</div>)
      }

      const { container, containerClass, data: baseAttrs } = merge(defaultBaseConfig, baseConfig)

      return (
        <transition name={transitionName} onAfterLeave={this.handleAfterLeave}>
          <div
            v-show={this.visible}
            class="fixed-wrapper"
            onTouchmove={prevent}
            {...{ attrs: baseAttrs }}
          >
            <container class={generateClass([ containerClass, type ])}>
              {defaultNode}
              {customNode}
            </container>

            <div class="mask-wrapper"></div>
          </div>
        </transition>
      )
    }
  })
  instance.$mount()
  document.body.appendChild(instance.$el)

  return instance
}

const RDialog = dialog


export { RDialog }
