import axios from 'axios'
import { authHeader } from './authService'

export const getUserProfile = () =>
  axios.get('/api/user/profile', { headers: authHeader() })

export const updateUserProfile = (userData: UserData) =>
  axios.put('/api/user/profile', userData, { headers: authHeader() })

export const GetAllUsers = () =>
  axios.get('/api/users', { headers: authHeader() })
// add other protected endpoints here
