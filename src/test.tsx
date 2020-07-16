import {
  createApp, defineComponent, App, createVNode,
  PropType, toRefs, InjectionKey, inject, provide, reactive, ref,
} from 'vue'

import { VFModal } from './Modal'



interface ApiErrorState {
  msg: string
  code: number
}

const ApiErrorInjectionKey: InjectionKey<ApiErrorState> = Symbol()


const ApiError = defineComponent({
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
    provide(ApiErrorInjectionKey, {
      code: 10086,
      msg: 'api test'
    })

    return <>
      <p>Api Error</p>
      <p> msg:{msg.value}</p>
    </>
  }
})


const store = reactive({
  state: {
    n: 1,
  },
  inc () {
    store.state.n++
  },
})

const Store: InjectionKey<typeof store> = Symbol()

const provideStore = () => {
  provide(Store, store)
}

const useStore = () => inject(Store)

const vf = new VFModal({
  test: ApiError
}, provideStore)


