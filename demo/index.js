import { createVfModal } from '../dist/brower/index.js'

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
      ref: 'item',
      on: {
        click: () => { },
        custom: (instance, type, ...args) => {
          instance.close()
        }
      }
    }
  ],
  abCde: [
    'close',
    {
      component: 'div',
      slot: 'ab-cde'
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
  transitionName: 'fade',
  conatainerProps: {
    id: '123',
  }
})
window.openModal = async () => {
  const { instance } = await Dialog({
    type: 'net',
    awaitClose: false,
    containerClass: 'any',
    containerStyle: {
      zIndex: 200
    },
    props: {
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
    },
  })

  console.log(instance.$refs)
}

