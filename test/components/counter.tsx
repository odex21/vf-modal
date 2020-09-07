import { defineComponent } from 'vue'

export const Counter = defineComponent({
  name: 'Counter',
  props: {
    a: {
      type: String,
      default: 'abc'
    }
  },

  data () {
    return {
      count: 0
    }
  },

  methods: {
    increment () {
      this.count++
    }
  },
  template: `
  <div>
  <span class="count">{{ count }}</span>
  <button @click="increment">Increment</button>
  </div>
  `
})
