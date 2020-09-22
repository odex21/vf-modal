<template>
  <div>
    <p>content</p>
    <button @click="handleClick"></button>
  </div>
</template>
<script>
export default {
  name: 'Base',
  emits: ['close'],
  methods: {
    handleClick() {
      this.$emit('close')
    }
  }
}
</script>
