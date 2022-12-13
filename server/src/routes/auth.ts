import { Router } from 'express'
import { createUser, validateUser } from '../db/users'
import { ensureAuthenticated, ensureNotAuthenticated } from '../middleware/auth'
import { authenticateUser } from '../utils/authFunctions'
import { areValidStrings, isValidUser } from '../utils/errorChecks'
import { sendServerError, sendServerSuccess } from '../utils/routeFunctions'

const authRouter = Router()

authRouter.get(
  '/isAuthenticated/:userId',
  ensureAuthenticated,
  async (req, res) => {
    return sendServerSuccess(res, authenticateUser(req.params.userId))
  }
)

authRouter.post('/signup', ensureNotAuthenticated, async (req, res) => {
  // const user = (({
  //   firstname,
  //   lastname,
  //   birthdate,
  //   gender,
  //   nationalities,
  //   email,
  //   username,
  //   password,
  // }: UserProfile) => ({
  //   firstname,
  //   lastname,
  //   birthdate,
  //   gender,
  //   nationalities,
  //   email,
  //   username,
  //   password,
  // }))(req.body)
  const user: UserProfile = req.body

  // error check
  try {
    isValidUser(user)
  } catch (err) {
    return sendServerError(res, 400, err, __filename)
  }

  // create new user
  try {
    return sendServerSuccess(res, await createUser(user))
  } catch (err) {
    return sendServerError(res, 500, String(err), __filename)
  }
})

authRouter.post('/login', ensureNotAuthenticated, async (req, res) => {
  const { username, password } = req.body

  // error check
  try {
    areValidStrings({ username, password })
  } catch (err) {
    return sendServerError(res, 400, String(err), __filename)
  }

  // authenticate user
  try {
    const auth = await validateUser({ username, password })
    if (auth.authenticated) return sendServerSuccess(res, auth)
    else
      return sendServerError(
        res,
        401,
        'Invalid username or password',
        __filename
      )
  } catch (err) {
    return sendServerError(res, 500, String(err), __filename)
  }
})

export default authRouter
