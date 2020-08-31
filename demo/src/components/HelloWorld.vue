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
  </p>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { Controller } from './modalA'

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
  setup () {
    const count = ref(0)
    const msg = ref('a')
    const openModal = async () => {
      const { emitter, isClosed } = Controller.open('test', { msg })
      emitter.on('hhh', () => {
        console.log('on hhh')
        addMsg()
      })
      await isClosed()
      console.log('close  sss')
    }

    const addMsg = () => {
      msg.value += 'a'
    }

    onMounted(() => {
      // openModal()
    })

    return {
      count,
      openModal,
      addMsg
    }
  }
})
</script>
