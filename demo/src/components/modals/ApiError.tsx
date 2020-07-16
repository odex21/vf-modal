import {
  createApp, defineComponent, App, createVNode,
  PropType, toRefs, InjectionKey, inject, provide, reactive, ref,
} from 'vue'

import './index.styl'
import { useStore } from '../modalShare'


interface ApiErrorState {
  msg: string
  code: number
}
export const ApiErrorInjectionKey: InjectionKey<ApiErrorState> = Symbol()


export const ApiError = defineComponent({
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
    const data = useStore()
    if (!data) throw Error('???')

    const { state } = data
    return () =>
      <div class="api-error-container">
        <p>Api Error</p>
        <p> msg:{msg.value}</p>
        <p>{state.n}</p>
      </div>
  }
})