import axios from 'axios'
import { authHeader } from './authService'

export const getUserProfile = () =>
  axios.get('/api/user/profile', { headers: authHeader() })

export const updateUserProfile = (userData: UserData) =>
  axios.put('/api/user/profile', userData, { headers: authHeader() })

export const getAllUsers = () =>
  axios.get('/api/users', { headers: authHeader() })

export const getPublicChannels = () =>
  axios.get('/api/channels/public', { headers: authHeader() })

export const getPublicChannelInfo = (channelId: string) =>
  axios.get('/api/channels/public/' + channelId, { headers: authHeader() })