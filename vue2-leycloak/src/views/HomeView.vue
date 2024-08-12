<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button @click="signIn">sign in</button>
  </div>
</template>

<script>
import { signIn, getToken, getAuthState, getUserProfile } from '@/utils/kc'

export default {
  name: 'HomeView',
  components: {},
  mounted() {
    if (getAuthState()) {
      const token = getToken()
      console.log(token)
      getUserProfile().then((res) => {
        console.log(res)
      })
    }
  },
  methods: {
    async signIn() {
      await signIn()
    },
  },
}
</script>
