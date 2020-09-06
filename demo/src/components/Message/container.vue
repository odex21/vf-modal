<template>
  <transition-group name="msg-list" tag="div">
    <slot />
    <!-- <span v-for="item in items" :key="item" class="list-complete-item">
      {{ item }}
    </span>-->
  </transition-group>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  methods: {
    shuffle() {
      this.items = _.shuffle(this.items)
    },
    add() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove() {
      this.items.splice(this.randomIndex(), 1)
    },
    randomIndex() {
      console.log('??', this.items.length)
      return Math.floor(Math.random() * this.items.length)
    },
  }
}
</script>

<style lang="stylus">
.msg-wrapper {
  position: fixed
  top: 0
  right: 0
}

.msg-wrapper {
  //display: flex
  //flex-flow: column
}

.msg-list-item {
  transition: all 0.8s ease
  display: inline-block
  //margin-top: 10px
  margin-right: 10px
}

.msg-list-leave-active {
  //transition: all 1s ease
  position: absolute
}

.msg-list {
  &-enter-from, &-leave-to {
    opacity: 0
    transform: translateX(30px)
  }
}
</style>
