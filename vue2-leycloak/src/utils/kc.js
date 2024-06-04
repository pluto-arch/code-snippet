import Keycloak from 'keycloak-js'

const config = {
  url: 'http://192.168.0.126:8080',
  realm: 'test',
  clientId: 'vue_client',
}

export const kc = new Keycloak(config)

kc.init({ onLoad: 'check-sso' })
  .then((authenticated) => {
    if (authenticated) {
      console.log('User is authenticated')
    } else {
      console.log('User is not authenticated')
    }
  })
  .catch((error) => {
    console.error('Keycloak initialization error:', error)
  })

export const signIn = () => {
  kc.login()
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getToken = () => {
  return kc.token || 'no token'
}

export const getAuthState = () => {
  return kc.authenticated || false
}

export const getUserProfile = () => {
  return kc.loadUserProfile()
}
