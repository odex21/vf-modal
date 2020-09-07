<template>
  <div class="h-msg-box-container">
    <!-- <p v-if="title" class="msg-box-title">{{ title }}</p> -->
    <div class="msg-box-content">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

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
  },
  emits: [ 'on-mounted' ],
  setup (_, { emit }) {
    onMounted(() => {
      console.log('log')
      emit('on-mounted')
    })
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