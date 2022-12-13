import axios from 'axios'
import { authHeader } from './authService'

export const getUserProfile = () =>
  axios.get('/api/user/profile', { headers: authHeader() })

export const updateUserProfile = (userData: UserProfile) =>
  axios.put('/api/user/profile', userData, { headers: authHeader() })

// export const postReview = (reviewData) => {
//   return axios.post('/api/reviews', reviewData, { headers: authHeader() })
// }

// export const postItem = (id) => {
//   return axios.put('/api/user/watchlist', {}, { headers: authHeader() })
// }

// export const deleteItem = (itemId) => {
//   return axios.delete('/api/user/watchlist', {
//     data: { itemId },
//     headers: authHeader(),
//   })
// }
