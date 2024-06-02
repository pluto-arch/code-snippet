import './index.css'

import { createApp } from 'vue'
import store from '@/stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(store)
app.use(router)

import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from 'keycloak-js'
import { useKeycloakStore } from '@/stores'

const keycloakConfig: KeycloakConfig = {
  url: 'http://192.168.0.126:8080',
  realm: 'test',
  clientId: 'vue_client'
}

const keycloak = new Keycloak(keycloakConfig)
const keycloakStore = useKeycloakStore()
keycloakStore.keycloak = keycloak

const initOptions: KeycloakInitOptions = { onLoad: 'check-sso' }

keycloak
  .init(initOptions)
  .then((auth) => {
    console.log(auth, '111')
    app.mount('#app')
  })
  .catch(() => {
    console.error('Authentication failed')
    app.mount('#app')
  })
