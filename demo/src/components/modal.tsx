import { createVfModal } from '/vf-modal/index'
import NetError from './modals/NetError.vue'
import '/vf-modal/index.css'
import { ComponentProps } from '/@/../dist/props'
import { defineComponent, toRef, toRefs } from 'vue'

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
    return <>
      <p>Api Error</p>
      <p> msg:{msg.value}</p>
    </>
  }
})

export const vf = createVfModal('test', ApiError, {
  injectionKey: Symbol()
})


