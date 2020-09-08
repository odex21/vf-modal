// Import the mount() method from the test utils
// and the component you want to test
import { mount, flushPromises } from '@vue/test-utils'
import { Counter } from './components/counter'
import { createVfModal } from '../src/index'
import Base from './components/Base.vue'
import { nextTick, onErrorCaptured, defineComponent, createApp } from 'vue'
import { sleep } from './utils'
jest.setTimeout(30 * 1000)
// import { ComponentOptions } from 'vue/types/options'
// type A = typeof Counter
// type C = ComponentOptions<A>


describe('load a simple vue component', () => {
  const { Controller, VfModal } = createVfModal({
    modals: {
      test: {
        component: Counter,
      }
    },
    closeWhenRouteChanges: false
  })

  const wrapper = mount(VfModal)


  it('renders the correct markup', async () => {
    Controller.open('test')
    await nextTick()
    expect(wrapper.html()).toContain('<span class="count">0</span>')
    expect(wrapper.get('button')).not.toBe(null)

  })

  it('button should increment the count', async () => {
    Controller.open('test')
    const instance = wrapper.getComponent(Counter)

    const vm = instance.vm
    expect(vm.count).toBe(0)

    const button = wrapper.find('button')
    button.trigger('click')
    expect(vm.count).toBe(1)
  })


  it('error type should throw error', async () => {
    try {
      Controller.open('a')
    } catch (error) {
      expect(error.message).toBe('can not find the modal by key: a')
    }
  })

  it('miss type should throw error', async () => {
    try {
      Controller.open()
    } catch (error) {
      expect(error.message).toBe('can not find the modal by key: undefined')
    }
  })
})



describe('close event handler', () => {

  it('modal emit close event should close modal', async () => {
    const { VfModal, Controller } = createVfModal({
      modals: {
        test: {
          component: Base,
        }
      },
      closeWhenRouteChanges: false
    })
    const Wrapper = mount(VfModal)
    const { isClosed, renderList } = Controller.open('test')

    await nextTick()

    const buttonEl = Wrapper.find('button')

    isClosed()
      .then(() => {
        expect(renderList.length).toBe(0)
      })
    buttonEl.trigger('click')
  })


  it('when modal is closed isClose should work well', async () => {
    const { VfModal, Controller } = createVfModal({
      modals: {
        test: {
          component: Base,
        }
      },
      closeWhenRouteChanges: false
    })
    const { isClosed, renderList, close } = Controller.open('test')

    close()
    const state = await isClosed()
    expect(state).toBeUndefined()

    const item = renderList.find(el => el.key === 'test')
    expect(item).toBeFalsy()
  })



  it('click mask should do nothing', async () => {
    const { Controller, VfModal } = createVfModal({
      modals: {
        abCd:
        {
          component: Base,
          ref: 'base',
        }
      },
      maskWrapper: { autoCloseModal: true },
      closeWhenRouteChanges: false
    })

    const Wrapper = mount(VfModal)
    const { renderList } = Controller.open('abCd')
    expect(renderList.find(el => el.key === 'abCd')!.isOpened).toBeTruthy()

    Wrapper.find('.vf-modal-mask-wrapper').trigger('click')

    expect(renderList.length).toBe(0)
  })



  it('close modal by Controller', async () => {
    const { VfModal, Controller } = createVfModal({
      modals: {
        abCd: {
          component: Base,
        },
        abCde: {
          component: Base,
        }
      }
    })

    mount(VfModal)

    const { renderList, isClosed } = Controller.open('abCd')
    Controller.open('abCde')

    expect(renderList.length).toBe(2)
    Controller.close()
    await isClosed()
    expect(renderList.length).toBe(0)
  })
})


// describe('custom options', () => {
//   const dialog = createVfModal({
//     abCd: [
//       {
//         component: Base,
//         ref: 'base',
//       }
//     ]
//   }, {
//     containerClass: 'custom-wrapper',
//     containerStyle: {
//       background: 'red'
//     },
//     maskClosable: true
//   })
//   const getWrapper = async () => {
//     const { instance } = await dialog({ type: 'abCd', awaitClose: false })
//     return createWrapper(instance)
//   }

//   const dialog2 = createVfModal({
//     abCd: [
//       {
//         component: Base,
//         ref: 'base',
//       }
//     ]
//   }, {
//     maskClosable: true,
//     maskWrapperClass: 'custom-mask-wrapper'
//   })

//   it('hyphenate class', async () => {
//     const wrapper = await getWrapper()
//     const body = wrapper.vm.$refs.body
//     expect([ ...(body as any).classList ].some(e => e === 'ab-cd')).toBe(true)
//   })

//   it('custom wrapper class', async () => {
//     const wrapper = await getWrapper()
//     const body = wrapper.vm.$refs.body
//     expect([ ...(body as any).classList ].some(e => e === 'custom-wrapper')).toBe(true)
//   })


//   it('click mask should close modal', async () => {
//     const wrapper = await getWrapper()
//     const mask = wrapper.find('.mask-wrapper')
//     mask.trigger('click')
//     expect((wrapper.vm as any).closed).toBe(true)
//   })


//   it('custom wrapper style', async () => {
//     const wrapper = await getWrapper()
//     const body = wrapper.vm
//     expect(getComputedStyle(body.$el).background).toBe('red')
//   })

//   it('custom runtime Class', async () => {
//     const { instance } = await dialog({
//       type: 'abCd',
//       awaitClose: false,
//       containerClass: 'run-time'
//     })
//     const wrapper = createWrapper(instance)
//     const body = wrapper.vm.$refs.body
//     expect([ ...(body as any).classList ].some(e => e === 'custom-wrapper')).toBe(true)
//     expect([ ...(body as any).classList ].some(e => e === 'run-time')).toBe(true)
//   })


//   it('custom mask-wrapper', async () => {
//     const { instance } = await dialog2({
//       type: 'abCd',
//       awaitClose: false,
//     })
//     const wrapper = createWrapper(instance)
//     const body = wrapper.vm.$refs.body
//     expect(wrapper.find('.custom-mask-wrapper')).not.toBeNull()
//   })

// })
