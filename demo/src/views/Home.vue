<template>
  <div>
    <h1>Home</h1>
    <HelloWorld :msg="msg" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import {  } from "/@/"
import HelloWorld from '../components/HelloWorld.vue'

export default defineComponent({
  components: {
    HelloWorld
  },
  setup () {
    const msg = ref('changed !')

    return {
      msg
    }
  }
})
</script>

<style>
</style>