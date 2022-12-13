type AuthResponse =
  | {
      authenticated: false
      // userId: undefined
    }
  | {
      authenticated: true
      userId: string
      username: string
      access_token: string
    }
