import jwt from 'jsonwebtoken'
import { JWT_SECRET_STRING } from './env'

export const authenticateUser = (
  userId: string | false,
  username?: string,
  userProfilePhoto?: string | null | undefined,
): AuthResponse => {

  return userId && username && JWT_SECRET_STRING
    ? {
      userId,
      username,
      userProfilePhoto: userProfilePhoto,
      authenticated: true,
      access_token: jwt.sign({ id: userId }, JWT_SECRET_STRING, {
        expiresIn: 3600, // sec
      }),
    }
    : { authenticated: false }
}
