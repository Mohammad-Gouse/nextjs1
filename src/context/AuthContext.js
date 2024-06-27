// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

// ** Next Import
import { useRouter } from 'next/router'

import Configuration from './Configuration'
// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [roleBasedAccess, setRoleBasedAccess] = useState(null)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)
      if (storedToken) {
        setLoading(false)
        // setUser({ ...response.data.userData })
        const userDetails = {
          "userId": "e42dc697-3f6b-4744-8a72-9c4baed51368",
          "username": "Dhruvil",
          "email": "jatin@gmail.com",
          "employeeId": "TEXPLE5",
          "role": "user"
        }
        setUser(userDetails)
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios
      // .post(authConfig.loginEndpoint, params)
      .post(`${Configuration.baseUrl}/users/login`, params)
      .then(async response => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.message.token)
          : null
        params.rememberMe ? window.localStorage.setItem('role', response.data.message.role) : null

        setRoleBasedAccess(response.data.message.role)

        const returnUrl = router.query.returnUrl
        // setUser({ ...response.data.userData })

        const userDetails = {
          "userId": "e42dc697-3f6b-4744-8a72-9c4baed51368",
          "username": "Dhruvil",
          "email": "jatin@gmail.com",
          "employeeId": "TEXPLE5",
          "role": "user"
        }
        setUser(userDetails)
        window.localStorage.setItem('roles', response.data.message.role)
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(userDetails)) : null
        let redirectURL
        if (response.data.message.role == 'admin') {
          redirectURL = returnUrl && returnUrl !== '/admin-dashboard' ? returnUrl : '/admin-dashboard'
        } else {
          redirectURL = returnUrl && returnUrl !== '/view-price' ? returnUrl : '/view-price'
        }
        router.replace(redirectURL)
      })
      .catch(err => {
        setRoleBasedAccess(null)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem('roles')
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    roleBasedAccess,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
