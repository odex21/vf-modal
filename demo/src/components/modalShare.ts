import { provide, inject, reactive, InjectionKey } from 'vue'

const store = reactive({
  state: {
    n: 1,
  },
  inc () {
    store.state.n++
  },
})

const Store: InjectionKey<typeof store> = Symbol()

export const provideStore = () => {
  provide(Store, store)
}

export const useStore = () => {
  const data = inject(Store)
  if (!data) throw new Error('no data')
  return data
}

