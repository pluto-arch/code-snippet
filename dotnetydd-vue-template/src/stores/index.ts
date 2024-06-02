import { createPinia } from 'pinia'
import { useCountStore } from './modules/count'
import { useKeycloakStore } from './modules/keycloakStore'
const store = createPinia()
export default store
export { useCountStore, useKeycloakStore }
