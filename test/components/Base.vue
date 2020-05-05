<template>
  <div>
    <p>content</p>
    <button @click="handleClick"></button>
  </div>
</template>
<script>
export default {
  methods: {
    handleClick() {
      this.$emit('close', 'custom')
    }
  }
}
</script>
