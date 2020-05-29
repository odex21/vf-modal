import { createVfModal, ModalTypesGroup } from '/vf-modal/index'
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
type bbb = typeof ApiError
type ccc = bbb[ 'setup' ]
type aaa = ComponentProps<typeof ApiError>

type dddd = (typeof vf({ type: 'test' }))
type eee = typeof opt
type CVFProps = dddd<'test', eee[ 'test' ]>// extends (opt: (infer U)) => any ? U : never

const opt: ModalTypesGroup = {
  test: {
    component: ApiError,
    closeButton: true
  }
}
export const vf = createVfModal(opt)



export const testModal = () => {
  const back = vf({
    type: 'test',
    props: {
      msg: 'df',
    },
    on: {
      close: (a, b, c) => {
        a.$props
      }
    }
  })
  console.log(back)
}
