import { Router } from 'express'
import { getUserById, createUser, validateUser } from '../data/users'
import { ensureAuthenticated, ensureNotAuthenticated } from '../middleware/auth'
import { authenticateUser } from '../utils/auth'
import { areValidStrings, isValidUser } from '../utils/errors'

const authRouter = Router()

authRouter.get(
  '/isAuthenticated/:userId/:username',
  ensureAuthenticated,
  async ({ params: { userId, username } }, res) => {
    try {
      const data = await getUserById(userId)
      res
        .status(200)
        .json(authenticateUser(userId, username, data?.profilePhotoUrl))
    } catch (e) {
      res.status(200).json(authenticateUser(userId, username))
    }
  }
)

authRouter.post('/signup', ensureNotAuthenticated, async (req, res) => {
  const user: UserRegistrationInfo = req.body

  // error check
  try {
    isValidUser(user)
  } catch (err) {
    return res.status(400).send(String(err))
  }

  // create new user
  try {
    return res.status(200).json(await createUser(user))
  } catch (err: any) {
    if (err.type === 'exists') return res.status(409).send(err.message)
    else return res.status(500).send(String(err))
  }
})

authRouter.post('/login', ensureNotAuthenticated, async (req, res) => {
  const { username, password } = req.body

  // error check
  try {
    areValidStrings({ username, password })
  } catch (err) {
    return res.status(400).send(String(err))
  }

  // authenticate user
  try {
    const auth = await validateUser({ username, password })
    return auth.authenticated
      ? res.status(200).json(auth)
      : res.status(401).send('Invalid username or password')
  } catch (err) {
    return res.status(500).send(String(err))
  }
})

export default authRouter
