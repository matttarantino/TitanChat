import axios from 'axios'

export const signup = (
  profileData: UserRegistrationInfo & { passwordConfirmation: undefined }
) => {
  const { username, password } = profileData
  return axios
    .post('/api/auth/signup', profileData, { headers: authHeader() })
    .then(() => login({ username, password }))
}

export const login = (loginData: LoginSpecs) =>
  axios
    .post('/api/auth/login', loginData, { headers: authHeader() })
    .then(({ data }) => {
      if (data.access_token)
        localStorage.setItem('authInfo', JSON.stringify(data))
    })

export const logout = (): AuthResponse => {
  localStorage.removeItem('authInfo')
  return { authenticated: false }
}

export const getAuthInfo = (): AuthResponse =>
  JSON.parse(
    localStorage.getItem('authInfo') ?? JSON.stringify({ authenticated: false })
  )

export const authHeader = () => {
  const { access_token, userId }: any = getAuthInfo()
  if (access_token) return { access_token, user_id: userId }
}

export const authenticateUser = (
  userId: string | undefined,
  username: string | undefined
) =>
  axios.get(`/api/auth/isAuthenticated/${userId}/${username}`, {
    headers: authHeader(),
  })
