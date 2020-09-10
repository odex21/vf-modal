<template>
  <div class="net-error-container">
    <p>net error</p>
    <p>{{ msg.msg.value }}</p>
    <p>{{ state }}</p>
    <p>
      <button @click="inc">click me</button>
    </p>
    <p>
      <button @click="close()">close</button>
      <button @click="addMsg">addMsg</button>
    </p>
  </div>
</template>
<script lang="ts">
import Vue, { defineComponent, inject, PropType, onMounted, isRef } from 'vue'
import { useStore } from '../modalShare'
import { createVfModal, VfMODAL_STORE_KEY } from '/vf-modal/index'
// import { VfMODAL_STORE_KEY } from '/vf-modal/'
import { Emitter } from 'mitt'

export default defineComponent({
  name: 'Test',
  props: {
    msg: {
      default: () => ({ msg: 'netError' }),
      type: Object
    },
  },
  emits: [ 'hhh', 'close' ],
  setup (props, { emit }) {
    const { state, inc } = useStore()

    const baseState = inject(VfMODAL_STORE_KEY)
    if (!baseState) throw Error('no data')

    console.log('isRef', isRef(props.msg))


    const close = () => {
      emit('close')
      console.log('close ?')
    }

    onMounted(() => {
      console.log('hhhhhh')

      emit('hhh')
      // props.emitter.emit('hhh')
    })

    const addMsg = () => {
      emit('hhh')
    }

    return {
      state,
      inc,
      close,
      addMsg
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