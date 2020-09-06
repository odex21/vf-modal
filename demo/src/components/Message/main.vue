<template>
  <div class="h-msg-box-container">
    <!-- <p v-if="title" class="msg-box-title">{{ title }}</p> -->
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
.h-msg-box-container {
  transition: all 0.8s ease;
  margin-top: 10px;
  width: 300px;
}
</style>