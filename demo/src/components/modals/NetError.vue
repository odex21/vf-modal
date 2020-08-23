<template>
  <div class="net-error-container">
    <p>net error</p>
    <p>{{ state }}</p>
    <p>
      <button @click="inc">click me</button>
    </p>
    <p>
      <button @click="close()">close</button>
    </p>
  </div>
</template>
<script lang="ts">
import Vue, { defineComponent, inject, PropType, onMounted } from 'vue'
import { useStore } from '../modalShare'
import { createVfModal, VfMODAL_STORE_KEY } from '/vf-modal/index'
// import { VfMODAL_STORE_KEY } from '/vf-modal/'
import { Emitter } from 'mitt'

export default defineComponent({
  props: {
    msg: {
      default: 'netError',
      type: String
    },
    emitter: {
      type: Object as PropType<Emitter>,
      required: true
    }
  },
  setup (props, { emit }) {
    const { state, inc } = useStore()

    const baseState = inject(VfMODAL_STORE_KEY)
    if (!baseState) throw Error('no data')

    const close = () => {
      emit('close')
      console.log('close ?')
    }

    onMounted(() => {
      props.emitter.emit('hhh')
    })

    return {
      state,
      inc,
      close
    }
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