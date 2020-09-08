import { createVfModal, EventMap } from '/vf-modal/index'
import MessageVue from './main.vue'
import Container from './container.vue'
import { Handler } from 'mitt'
import { mergeRight } from 'ramda'

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
  title?: string
  timeout?: number,
  on?: EventMap
}

const Message = (msg: string, opt?: MessageOptions) => {
  const { timeout, title, on } = mergeRight({ timeout: 2000, title: '', on: {} } as MessageOptions, opt || {},)

  const { close } = Controller.open('msg', {
    props: {
      text: msg,
      title
    },
    on
  })

  setTimeout(() => {
    close()
  }, timeout)
}

export {
  VfModal as MessageModal,
  Message
}