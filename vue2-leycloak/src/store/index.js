import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const user = () => {
  return JSON.parse(localStorage.getItem('user'))
}

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
})
