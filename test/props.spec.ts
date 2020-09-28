import { mount } from '@vue/test-utils'
import { createVfModal } from '../src/index'
import ModeA from './components/ModeA.vue'
import { nextTick } from 'vue'

describe('test prpos', () => {
  const { VfModal, Controller } = createVfModal({
    modals: {
      test: {
        component: ModeA,
      },
    },
    closeWhenRouteChanges: false
  })

  const wrapper = mount(VfModal)


  it('test props with a sfc component', async () => {
    Controller.open('test', {
      props: {
        b: 123,
        a: 'test'
      }
    })
    await nextTick()
    const instance = wrapper.getComponent(ModeA)

    expect((instance.vm as any).a).toBe('test')
    expect((instance.vm as any).b).toBe(123)
  })

  it('test On  a sfc component', async () => {
    let type
    Controller.open('test', {
      props: {
        b: 123,
        a: '123',
      },
      on: {
        event: () => {
          type = 'event'
        },
        customEvent: () => {
          type = 'customEvent'
        }
      }
    })
    await nextTick()

    const eventButton = wrapper.find('.event')
    const customButton = wrapper.find('.customEvent')

    eventButton.trigger('click')
    expect(type).toBe('event')
    customButton.trigger('click')
    expect(type).toBe('customEvent')
  })


})
