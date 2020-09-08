<template>
  <div>
    <div>mode a</div>
    <slot />
    <button class="event" @click="handleClick('event')">emit A</button>
    <button class="customEvent" @click="handleClick('customEvent')">emit A</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Test',
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
  emits: ['event', 'customEvent'],
  methods: {
    handleClick(eventName) {
      this.$emit(eventName, eventName, this.a, this.b)
    }
  }
})
</script>

