import { createWrapper } from '@vue/test-utils'
import { createVfModal } from '../src/index'
import ModeA from './components/ModeA.vue'
// import Vue from 'vue'

describe('test prpos', () => {
  const dialog = createVfModal({
    test: [
      {
        component: ModeA,
        ref: 'modeA',
        defaultProps: {
          a: 'test'
        }
      },
      {
        component: 'div',
        className: 'custom-div'
      }
    ]
  })

  it('send props', async () => {
    const { instance } = await dialog({
      type: 'test',
      awaitClose: false,
      props: {
        b: 123
      }
    })

    expect(instance.$refs.modeA.a).toBe('test')
    expect(instance.$refs.modeA.b).toBe(123)
  })

  it('test runOn', async () => {
    let type, a, b
    const { instance } = await dialog({
      type: 'test',
      awaitClose: false,
      props: {
        b: 123
      },
      on: {
        event: (instance, ...args) => {
          [ type, a, b ] = args
        },
        // customEvent: {
        //   name: 'test',
        //   fn: (instance, ...args) => {
        //     console.log(...args);
        //     [ type, a, b ] = args
        //   }
        // }
        customEvent: {
          name: 'test',
          fn: (instance, ...args) => {
            [ type, a, b ] = args
          }
        }
      }
    })

    const wrapper = createWrapper(instance)
    const eventButton = wrapper.find('.event')
    const customButton = wrapper.find('.customEvent')
    eventButton.trigger('click')
    expect(type).toBe('event')
    expect(a).toBe('test')
    expect(b).toBe(123)


    // customButton.trigger('click')
    // expect(type).toBe('customEvent')
    // expect(a).toBe('test')
    // expect(b).toBe(123)
  })


})
