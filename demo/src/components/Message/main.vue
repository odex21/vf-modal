<template>
  <div class="h-msg-box-container">
    <div v-if="title" class="msg-box-title">{{ title }}</div>
    <div class="msg-box-content">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HMessage',
  props: {
    text: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    }
  }
})
</script>

<style>
</style>