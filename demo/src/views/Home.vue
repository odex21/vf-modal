<template>
  <div>
    <h1>Home</h1>
    <HelloWorld />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import {  } from "/@/"
import HelloWorld from '../components/HelloWorld.vue'

export default defineComponent({
  components: {
    HelloWorld
  },
  setup () {

  }
})
</script>

<style>
</style>