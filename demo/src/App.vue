<template>
  <div>
    <router-link to="/">home</router-link>
    <router-link to="/other">other</router-link>
  </div>
  <img alt="Vue logo" src="./assets/logo.png" />
  <router-view />
  <modal-test />
</template>

<script>
import { ModalTest } from './components/modalA'

export default {
  name: 'App',
  components: {
    ModalTest
  }
}
</script>
