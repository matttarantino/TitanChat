import jwt from 'jsonwebtoken'

export const authenticateUser = (
  userId: string | false,
  username?: string
): AuthResponse => {
  const { JWT_SECRET_STRING } = process.env
  return userId && username && JWT_SECRET_STRING
    ? {
        userId,
        username,
        authenticated: true,
        access_token: jwt.sign({ id: userId }, JWT_SECRET_STRING, {
          expiresIn: 3600, // sec
        }),
      }
    : { authenticated: false }
}
