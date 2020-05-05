import Vue from 'vue'

export default Vue.extend({
  template: `
  <div>
  <span class="count">{{ count }}</span>
  <button @click="increment">Increment</button>
  </div>
  `,

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
  }
})
