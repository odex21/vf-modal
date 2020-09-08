import { defineComponent, ref } from 'vue'

export const Counter = defineComponent({
  name: 'Counter',
  props: {
    a: {
      type: String,
      default: 'abc'
    }
  },
  setup () {
    const count = ref(0)
    const increment = () => count.value++

    return {
      count,
      increment
    }
  },
  render () {
    return <div>
      <span class="count">{this.count}</span>
      <button onClick={this.increment}>Increment</button>
    </div>
  },
  // template: `
  // <div>
  // <span class="count">{{ count }}</span>
  // <button @click="increment">Increment</button>
  // </div>
  // `
})
