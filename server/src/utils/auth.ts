import jwt from 'jsonwebtoken'
import { JWT_SECRET_STRING } from './env'

export const authenticateUser = (
  userId: string | false,
  username?: string,
  userProfilePhoto?: string | null
): AuthResponse => {
  return userId && username && JWT_SECRET_STRING
    ? {
        userId,
        username,
        userProfilePhoto: userProfilePhoto ?? null,
        authenticated: true,
        access_token: jwt.sign({ id: userId }, JWT_SECRET_STRING, {
          expiresIn: 30, // sec
        }),
      }
    : { authenticated: false }
}
