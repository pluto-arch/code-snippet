import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { initKc } from './utils/kc'

Vue.config.productionTip = false

var vue = new Vue({
  router,
  store,
  render: (h) => h(App),
})

initKc(() => {
  vue.$mount('#app')
  vue.$router.push('/')
})
