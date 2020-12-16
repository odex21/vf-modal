<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <p>
    <button @click="openModal('test')">open modal</button>
    <button @click="addMsg">open modal</button>
    <button @click="logMsg">msg</button>
  </p>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, unref, proxyRefs, isRef } from 'vue'
import { Controller } from './modalA'
import { Message } from '../components/Message'


export default defineComponent({
  name: 'HelloWorld',
  components: {
  },
  props: {
    msg: {
      default: '',
      type: String
    },

  },
  setup (props,) {
    const count = ref(0)
    const msg = ref('a')
    console.log('is ref msg hello', isRef(props.msg))

    const openModal = async () => {
      const { isClosed } = Controller.open('test', {
        props: { msg },
        on: {
          hhh: () => {
            console.log('on hhh')
            addMsg()
            openModalTestIndex()
          }
        },
        zIndex: 10
      })
      // await isClosed()
      await Controller.isClosed()
      console.log('close  sss')
    }

    const openModalTestIndex = async () => {
      const { isClosed } = Controller.open('test', {
        props: { msg },
        on: {
          hhh: () => {
            console.log('on hhh')
            addMsg()
          }
        },
        zIndex: 100
      })
    }

    const addMsg = () => {
      msg.value += 'a'

    }

    const logMsg = () => {
      Message('test msg', {
        on: {
          'on-mounted': (...args: any[]) => {
            console.log('mounted', ...args)
          }
        }
      })
    }

    onMounted(() => {
      // openModal()
    })

    return {
      count,
      openModal,
      addMsg,
      logMsg
    }
  }
})
</script>
