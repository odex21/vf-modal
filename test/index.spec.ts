// Import the mount() method from the test utils
// and the component you want to test
import { mount, flushPromises } from '@vue/test-utils'
import { Counter } from './components/counter'
import { createVfModal } from '../src/index'
import Base from './components/Base.vue'
import { nextTick } from 'vue'
import { sleep } from './utils'

// import { ComponentOptions } from 'vue/types/options'
// type A = typeof Counter
// type C = ComponentOptions<A>


describe.only('load a simple vue component', () => {
  const { Controller, VfModal } = createVfModal({
    modals: {
      test: {
        component: Counter,
      }
    },
    closeWhenRouteChanges: false
  })

  const getWrapper = () => {
    return {
      wrapper: mount(VfModal)
    }
  }

  it('renders the correct markup', async () => {
    const { wrapper } = getWrapper()
    Controller.open('test')
    await nextTick()
    expect(wrapper.html()).toContain('<span class="count">0</span>')
    expect(wrapper.get('button')).not.toBe(null)

  })

  it('button should increment the count', async () => {
    const { wrapper } = await getWrapper()
    Controller.open('test')
    const instance = wrapper.getComponent(Counter)

    const vm = instance.vm
    expect(vm.count).toBe(0)

    const button = wrapper.find('button')
    button.trigger('click')
    expect(vm.count).toBe(1)
  })


  it.skip('error type should throw error', async () => {
    Controller.open({ type: 'a' })
  })

  it('miss type should throw error', () => {
    try {
      Controller.open({})
    } catch (error) {
      expect(error.message).toBe('must have a key')
    }
  })
})

// describe('load single-file component', () => {
//   const dialog = createVfModal({
//     test: [
//       {
//         component: Base,
//         ref: 'base'
//       }
//     ]
//   })
//   const getWrapper = async () => {
//     const { instance } = await dialog({ type: 'test', awaitClose: false })
//     return createWrapper(instance)
//   }

//   it('renders the correct markup', async () => {
//     const wrapper = await getWrapper()
//     expect(wrapper.html()).toContain('<p>content</p>')
//   })

//   it('ref can be used and button should emit a close event', async () => {
//     const wrapper = await getWrapper()
//     const counter = wrapper.vm.$refs.base
//     expect((wrapper.vm as any).closed).toBe(false)
//     const button = wrapper.find('button')
//     button.trigger('click')
//     expect((wrapper.vm as any).closed).toBe(true)
//   })
// })

// describe('close event handler', () => {

//   /**
//    * 测试自定义关闭事件
//    */
//   it('ref can be used and button should emit a close event', async () => {
//     const waitClose = (): Promise<{ instance: any, type: any }> => new Promise(async (resolve, rejecj) => {
//       const dialog = createVfModal({
//         test: [
//           {
//             component: Base,
//             ref: 'base',
//             on: {
//               close: (instance, type) => {
//                 resolve({ instance, type })
//               }
//             }
//           }
//         ]
//       })
//       const { instance, type } = await dialog({ type: 'test', awaitClose: false })
//       expect(type === 'instance').toBe(true)
//       const wrapper = createWrapper(instance)
//       const button = wrapper.find('button')
//       button.trigger('click')
//     })

//     const { instance, type } = await waitClose()
//     expect(instance instanceof Vue).toBe(true)
//     expect(type).toBe('custom')
//   })


//   /**
//    * 测试close 组件
//    */
//   it('base close', async () => {
//     const waitClose = (): Promise<{ instance: any, type: any }> => new Promise(async (resolve, rejecj) => {
//       const dialog = createVfModal({
//         test: [
//           {
//             component: Base,
//             ref: 'base',
//           },
//           'close'
//         ]
//       })

//       const { instance } = await dialog({
//         type: 'test',
//         awaitClose: false,
//         onClose: (instance, type) => {
//           resolve({ instance, type })
//         }
//       })

//       const wrapper = createWrapper(instance)
//       const button = wrapper.findComponent({ ref: "closeButton" })
//       expect(button.exists()).toBe(true)
//       button.trigger('click')
//     })

//     const { type, instance } = await waitClose()
//     expect(type).toBe('close')
//     instance.chosed = false

//   })


//   it('click mask should do nothing', async () => {
//     const dialog = createVfModal({
//       abCd: [
//         {
//           component: Base,
//           ref: 'base',
//         }
//       ]
//     }, {
//       containerClass: 'custom-wrapper',
//       containerStyle: {
//         background: 'red'
//       },
//     })
//     const getWrapper = async () => {
//       const { instance } = await dialog({ type: 'abCd', awaitClose: false })
//       return { wrapper: createWrapper(instance), instance }
//     }


//     const { instance, wrapper } = await getWrapper()
//     const mask = wrapper.find('.mask-wrapper')
//     mask.trigger('click')
//     expect(instance.closed).toBe(false)
//     await Vue.nextTick()
//     expect(instance.visible).toBe(true)

//   })



//   it('change closed on instance, closed only can be used to close modal', async () => {
//     const dialog = createVfModal({
//       abCd: [
//         {
//           component: Base,
//           ref: 'base',
//         }
//       ]
//     })
//     const { instance } = await dialog({ type: 'abCd', awaitClose: false })

//     instance.closed = true
//     await Vue.nextTick()
//     expect(instance.visible).toBe(false)

//     instance.closed = false
//     await Vue.nextTick()
//     expect(instance.visible).toBe(false)

//     // await  transition
//     await sleep(1000)
//   })
// })


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
