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
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { ModalTest, Controller } from './modalA'

export default defineComponent({
  name: 'HelloWorld',
  components: {
    ModalTest
  },
  props: {
    msg: {
      default: '',
      type: String
    }
  },
  setup () {
    const count = ref(0)
    const openModal = () => Controller.open('test')

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
