import { createVfModal } from '/vf-modal/index'
import MessageVue from './main.vue'
import Container from './container.vue'

const { Controller, VfModal } = createVfModal({
  modals: {
    msg: {
      component: MessageVue,
    }
  },
  maskWrapper: {
    classname: 'no-mask',
  },
  multipleModal: true,
  fixWrapperClassname: 'msg-wrapper',
  container: Container
})

export interface MessageOptions {
  title: string
  timeout: number
}

const Message = (msg: string, opt?: MessageOptions) => {
  const { timeout, title } = opt || { timeout: 2000 }

  const { close } = Controller.open('msg', {
    text: msg,
    title
  })

  setTimeout(() => {
    close()
  }, timeout)
}

export {
  VfModal as MessageModal,
  Message
}