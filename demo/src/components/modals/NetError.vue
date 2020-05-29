<template>
  <div class="net-error-container">
    <p>net error</p>
  </div>
</template>
<script lang="ts">
import Vue, { defineComponent } from 'vue'
export default defineComponent({
  props: {
    msg: {
      default: '123',
      type: String
    }
  },
  setup (props) {

  }
})
</script>
<style lang="stylus" scoped>
.net-error-container {
  width: 300px
  height: 300px
  background: #fff
}
</style>