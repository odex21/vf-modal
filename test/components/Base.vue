<template>
  <div>
    <p>content</p>
    <button @click="handleClick"></button>
  </div>
</template>
<script>
export default {
  emits: ['close'],
  methods: {
    handleClick() {
      this.$emit('close', 'custom')
    }
  }
}
</script>
