import jwt from 'jsonwebtoken'
import { getUserById } from '../data/users'
import { JWT_SECRET_STRING } from '../utils/env'

/**
 * @author rgorai
 * @description middleware to ensure that the user is authenticated
 *              using an access tken and valid userId before proceeding
 *              to the next middleware
 * @returns 401 error if user is not authenticated, next() if user is
 */
export const ensureAuthenticated = async (req: any, res: any, next: any) => {
  const { access_token, user_id } = req.headers

  // ensure token, user, and secret exist
  if (!(access_token && (await getUserById(user_id)) && JWT_SECRET_STRING))
    return res.status(401).send('No token, valid user, or secret provided.')

  // validate token
  jwt.verify(access_token, JWT_SECRET_STRING, (error: any, decoded: any) => {
    if (error) return res.status(401).send('Invalid token.')
    req.userId = decoded.id
    next()
  })
}

/**
 * @author rgorai
 * @description middleware to ensure that the user is not (already)
 *              authenticated before proceeding to the next middleware
 * @returns 401 error if user is authenticated, next() if user is not
 */
export const ensureNotAuthenticated = (req: any, res: any, next: any) => {
  const { access_token } = req.headers

  // ensure secret exists
  if (!JWT_SECRET_STRING) return res.status(401).send('No secret provided.')

  if (access_token !== null)
    // validate token
    jwt.verify(access_token, JWT_SECRET_STRING, (error: any) => {
      if (error) return next()
      return res.status(401).send('You are already logged in.')
    })
  else next()
}
