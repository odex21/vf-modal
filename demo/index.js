import { createVfModal } from '../dist/index.js'

const Dialog = createVfModal({
  net: [
    'close',
    {
      component: "div",
      slot: 'hello vfModal',
      className: 'component',
      defaultProps: {
        any: 'any'
      },
      on: {
        click: () => { },
        custom: (instance, type, ...args) => {
          instance.close()
        }
      }
    }
  ]
}, {
  closeButtonClass: 'abc',
  awaitClose: false,
  container: 'div',
  containerClass: 'class',
  containerStyle: {
    zIndex: 100
  },
  maskClosable: true,
  transitionName: 'fade'
})
window.openModal = () => {
  Dialog({
    type: 'net',
    awaitClose: false,
    containerClass: 'any',
    containerStyle: {
      zIndex: 200
    },
    data: {
      any: 'any'
    },
    maskClosable: true,
    on: {
      click: {
        name: 'Vue Component name',
        fn: () => { }
      },
      custom: (instance, type, ...args) => {

      }
    },
    onClose: (instance, type, ...args) => {
    }
  })
}

