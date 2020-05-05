<template>
  <div>
    <div>mode a</div>
    <slot />
    <button class="event" @click="onClick('event')">emit A</button>
    <button class="customEvent" @click="onClick('customEvent')">emit A</button>
  </div>
</template>

<script lang="ts">
type A = string
import Vue from 'vue'
export default Vue.extend({
  name: 'test',
  props: {
    a: {
      type: String,
      required: true
    },
    b: {
      type: Number,
      required: true
    }
  },
  methods: {
    onClick (eventName: string) {
      this.$emit(eventName, eventName, this.a, this.b)
    }
  }
})
</script>

