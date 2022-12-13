import jwt from 'jsonwebtoken'
import { getUser } from '../data/users'

const { JWT_SECRET_STRING } = process.env

export const ensureAuthenticated = async (req: any, res: any, next: any) => {
  const { access_token, user_id } = req.headers

  // ensure token, user, and secret exist
  if (!(access_token && (await getUser(user_id)) && JWT_SECRET_STRING))
    return res.status(401).send('No token, valid user, or secret provided.')

  // validate token
  jwt.verify(access_token, JWT_SECRET_STRING, (error: any, decoded: any) => {
    if (error) return res.status(401).send('Unauthorized')
    req.userId = decoded.id
    next()
  })
}

export const ensureNotAuthenticated = (req: any, res: any, next: any) => {
  const { access_token } = req.headers

  // ensure secret exists
  if (!JWT_SECRET_STRING) return res.status(401).send('No secret provided.')

  if (access_token !== null)
    // validate token
    jwt.verify(access_token, JWT_SECRET_STRING, (error: any) => {
      if (error) return next()
      return res.status(401).send('You are already signed in.')
    })
  else next()
}
