import Keycloak from 'keycloak-js'

const config = {
  url: 'http://192.168.0.126:8080',
  realm: 'test',
  clientId: 'vue_client',
}

export const kc = new Keycloak(config)

// kc.init({ onLoad: 'check-sso' })
//   .then((authenticated) => {
//     if (authenticated) {
//       console.log('User is authenticated')
//       window.location.href = '/about'
//     } else {
//       console.log('User is not authenticated')
//       window.location.href = '/about'
//     }
//   })
//   .catch((error) => {
//     console.error('Keycloak initialization error:', error)
//   })

export const initKc = (callback) => {
  kc.init({ onLoad: 'check-sso' })
    .then((authenticated) => {
      if (authenticated) {
        console.log('User is authenticated')
      } else {
        console.log('User is not authenticated')
      }
      callback()
    })
    .catch((error) => {
      console.error('Keycloak initialization error:', error)
      callback()
    })
}

export const signIn = async () => {
  alert(111111)
  kc.login({
    redirectUri: location.origin + '/#/kccallback',
  })
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.log(error)
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
