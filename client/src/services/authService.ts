import axios from 'axios'

export const signup = async (profileData: UserRegistrationInfo) => {
  const { username, password } = profileData
  return await axios
    .post('/api/auth/signup', profileData)
    .then(() => login({ username, password }))
}

export const login = async (loginData: LoginSpecs) => {
  return await axios.post('/api/auth/login', loginData).then(({ data }) => {
    if (data.access_token)
      localStorage.setItem('authInfo', JSON.stringify(data))
  })
}

export const logout = (): AuthResponse => {
  localStorage.removeItem('authInfo')
  return { authenticated: false }
}

export const getAuthInfo = (): AuthResponse =>
  JSON.parse(localStorage.getItem('authInfo') ?? '{"authenticated":false}')

export const authHeader = () => {
  const { access_token, userId }: any = getAuthInfo()
  if (access_token) return { access_token, user_id: userId }
}

export const authenticateUser = (userId: string | undefined) =>
  axios.get(`/api/auth/isAuthenticated/${userId}`, { headers: authHeader() })
