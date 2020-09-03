<template>
  <div>
    <router-link to="/">home</router-link>
    <router-link to="/other">other</router-link>
  </div>
  <img alt="Vue logo" src="./assets/logo.png" />
  <router-view />
  <modal-test />
  <message-modal />
</template>

<script>
import { ModalTest } from './components/modalA'
import { MessageModal } from './components/Message'

export default {
  name: 'App',
  components: {
    MessageModal,
    ModalTest
  }
}
</script>
