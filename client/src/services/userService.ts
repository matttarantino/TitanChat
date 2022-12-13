import axios from 'axios'
import { authHeader } from './authService'

export const getUserProfile = () =>
  axios.get('/api/user/profile', { headers: authHeader() })

export const updateUserProfile = (userData: UserData) =>
  axios.put('/api/user/profile', userData, { headers: authHeader() })

// any other procted service goes here, ie retrieving channel data, dm data, etc
