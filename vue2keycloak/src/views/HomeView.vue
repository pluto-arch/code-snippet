<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button @click="signIn">sign in</button>
  </div>
</template>

<script>
import { getAuthState, getToken, getUserProfile, signIn } from '@/utils/kc'

export default {
  name: 'HomeView',
  components: {},

  mounted() {
    console.log(123123)
    if (getAuthState()) {
      const token = getToken()
      console.log(token)
      getUserProfile().then((res) => {
        console.log(res)
      })
    } else {
      console.log('Not authenticated')
    }
  },
  methods: {
    async signIn() {
      await signIn()
    },
  },
}
</script>
