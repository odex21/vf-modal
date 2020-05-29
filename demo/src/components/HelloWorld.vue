<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import {  testModal } from './modal'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      default: '',
      type: String
    }
  },
  setup () {
    const count = ref(0)
    onMounted(() => {
      testModal()
    })
    return {
      count
    }
  }
})
</script>
