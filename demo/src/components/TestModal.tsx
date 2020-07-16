import { defineComponent, inject, toRaw, onMounted, ref } from 'vue'
import { vf } from './modalA'

const sleep = (time: number) => new Promise((res) => {
  setTimeout(() => {
    res()
  }, time)
})

export const TestModal = defineComponent({
  name: 'test-modal',
  setup (props) {
    const msg = ref('123')

    onMounted(async () => {
      const { } = vf({ type: 'api' })
      // while (!d) {
      //   d = inject(provideKey)
      //   console.log('no data')
      //   await sleep(100)
      // }
      // const { msg: m, instance } = d

      // msg.value = m || ''
    })

    return () =>
      <>
        <p>modal test</p>
        <p>{msg}</p>
      </>

  }
})