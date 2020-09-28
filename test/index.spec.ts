// Import the mount() method from the test utils
// and the component you want to test
import { mount, shallowMount } from '@vue/test-utils'
import { Counter } from './components/counter'
import { createVfModal } from '../src/index'
import Base from './components/Base.vue'
import { nextTick, onErrorCaptured, defineComponent, createVNode } from 'vue'
import { sleep } from './utils'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'

jest.setTimeout(30 * 1000)

describe('load a simple vue component', () => {
  const { Controller, VfModal } = createVfModal({
    modals: {
      test: {
        component: Counter,
      }
    },
    closeWhenRouteChanges: false
  })

  const Wrapper = mount(VfModal)
  let renderList: ReturnType<typeof Controller.open> extends { renderList: infer P } ? P : never

  it('renders the correct markup', async () => {
    const t = Controller.open('test')
    renderList = t.renderList
    await nextTick()
    expect(Wrapper.html()).toContain('<span class="count">0</span>')
    expect(Wrapper.get('button')).not.toBe(null)

  })

  it('button should increment the count', async () => {
    Controller.open('test')
    const instance = Wrapper.getComponent(Counter)

    const vm = instance.vm
    expect(vm.count).toBe(0)

    const button = Wrapper.find('button')
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

  it('click mask wrapper should do nonting', () => {
    Wrapper.find('.vf-modal-mask-wrapper').trigger('click')
    expect(renderList.length).toBe(1)
  })
})



describe('close handler', () => {

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



  it('mask wrapper should work', async () => {
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

  it('option of mask wrapper  should work', async () => {
    const { Controller, VfModal } = createVfModal({
      modals: {
        abCd:
        {
          component: Base,
          ref: 'base',
        }
      },
      maskWrapper: {
        clickHandler: (controller, emitter, instance) => {
          controller.close()
        },
        classname: 'test-class'
      },
      closeWhenRouteChanges: false
    })

    const Wrapper = mount(VfModal)
    const { renderList } = Controller.open('abCd')
    expect(renderList.find(el => el.key === 'abCd')!.isOpened).toBeTruthy()

    Wrapper.find('.test-class').trigger('click')

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


describe('muti modal', () => {
  const { VfModal, Controller } = createVfModal({
    modals: {
      test: {
        component: Base,
        zIndex: 1000,
      }
    },
    closeWhenRouteChanges: false,
    multipleModal: true
  })

  const Wrapper = mount(VfModal)

  it('open muti modal', async () => {
    Controller.open('test')
    const { close } = Controller.open('test')
    await nextTick()
    const list = Wrapper.findAllComponents(Base)
    expect(list.length).toBe(2)
    close()
    await nextTick()
    const reslist = Wrapper.findAllComponents(Base)
    expect(reslist.length).toBe(1)
  })
})


describe('custom options', () => {

  it('zIndex', async () => {
    const { VfModal, Controller } = createVfModal({
      modals: {
        test: {
          component: Base,
          zIndex: 1000,
        }
      },
      closeWhenRouteChanges: false
    })
    const Wrapper = mount(VfModal)
    Controller.open('test')
    await nextTick()
    const c = Wrapper.getComponent(Base)
    expect((c.element as any).style.zIndex).toBe("1000")
    Controller.open('test', { zIndex: 100 })
    await nextTick()
    expect((c.element as any).style.zIndex).toBe("100")
  })

  it('modal open/close hook should work well', async () => {
    let index = 0
    const { VfModal, Controller } = createVfModal({
      modals: {
        test: {
          component: Base,
          zIndex: 1000,
        }
      },
      closeWhenRouteChanges: false,
      on: {
        modalOpen: () => index++,
        modalClose: () => index++
      }
    })

    const transitionStub = () => ({
      render: function () {
        return this.$options._renderChildren
      }
    })

    mount(VfModal, {
      stubs: {
        transition: transitionStub
      }
    })

    Controller.open('test')

    await nextTick()
    await sleep(500)
    expect(index).toBe(1)

    Controller.close()
    await nextTick()

    Controller.isClosed()
      .then(() => {
        expect(index).toBe(2)
      })
    await nextTick()
    await sleep(500)
    expect(await Controller.isClosed()).toBe(void 0)
  })

  // it.only('close when router changed', async () => {
  //   const { VfModal, Controller } = createVfModal({
  //     modals: {
  //       test: {
  //         component: Base,
  //         zIndex: 1000,
  //       }
  //     },
  //     closeWhenRouteChanges: true
  //   })

  //   const router = createRouter({
  //     history: createWebHashHistory(),
  //     routes: [
  //       {
  //         component: () => createVNode('div', null, 'home'),
  //         path: '/'
  //       },
  //       {
  //         component: () => createVNode('div', null, 'foo'),
  //         path: '/foo'
  //       },
  //     ]
  //   })

  //   shallowMount({
  //     render: function (h) {
  //       return h('div', null, [
  //         h(RouterView),
  //         VfModal
  //       ])
  //     }
  //   }, { stubs: [ 'router-link', 'router-view' ] })


  //   const { renderList } = Controller.open('test')

  //   await nextTick()
  //   expect(renderList.length).toBe(1)

  //   await router.push('/foo')
  //   await nextTick()
  //   expect(router.currentRoute.value.path).toBe('/foo')
  //   await nextTick()
  //   await sleep(500)
  //   expect(renderList.length).toBe(0)
  // })
})
