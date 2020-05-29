import { createApp, defineComponent, App, createVNode, PropType } from 'vue'



interface TProps {
  val: string
}

const Modal = defineComponent({
  props: {
    msg: {
      required: false,
      type: String,
    },
    complexProps: {
      required: false,
      type: Object as PropType<{
        a: {
          b: number
        },
        c: string
      }>
    }
  },
  setup (props) {
    return () => {

      const slots = {
        default: () => [ <p>default</p> ],
        foo: (props: TProps) => [ <p>{props.val}</p> ]
      }

      return <div>{slots}</div>

    }
  }
})


type Writeable<T> = { -readonly [ P in keyof T ]: T[ P ] }
let modalContainerElem: HTMLElement

type ComponentProps<T extends { setup?: any }> = Writeable<
  T[ 'setup' ] extends
  ((this: void, props: (infer U), ctx: any) => any) | undefined ?
  U : never>

type a = Writeable<ComponentProps<typeof Modal>>



export const createModal = (_app?: App) => {
  if (!modalContainerElem) {
    modalContainerElem = document.createElement('div')
    modalContainerElem.id = 'vf-modal-container'
    document.body.appendChild(modalContainerElem)
  }
  const node = createVNode(Modal, {
    msg: 123,
  }, [ 'c h' ])
  const app = createApp(Modal)
  app.mount(modalContainerElem)
}