<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <p>
    <button @click="openModal('test')">open modal</button>
  </p>
  <modal-test />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, PropType } from 'vue'
import { ModalTest, Controller } from './modalA'
import { Emitter } from 'mitt'

export default defineComponent({
  name: 'HelloWorld',
  components: {
    ModalTest
  },
  props: {
    msg: {
      default: '',
      type: String
    },

  },
  setup () {
    const count = ref(0)
    const openModal = async () => {

      const { emitter, isClosed } = Controller.open('test')
      emitter.on('hhh', () => {
        console.log('on hhh')
      })
      await isClosed()
      console.log('close  sss')
    }

    onMounted(() => {
      // openModal()
    })

    return {
      count,
      openModal
    }
  }
})
</script>
