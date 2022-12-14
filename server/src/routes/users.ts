import { Router } from 'express'
import { getUser } from '../data/users'
import { areValidStrings } from '../utils/errors'
import { ensureAuthenticated } from '../middleware/auth'

const userRouter = Router()

userRouter.get('/profile', ensureAuthenticated, async (req, res) => {
  const { userId } = req as any

  // error check
  try {
    areValidStrings({ userId })
  } catch (err) {
    return res.status(400).send(String(err))
  }

  // send user data
  try {
    return res.status(200).json(await getUser(userId))
  } catch (err) {
    return res.status(500).send(String(err))
  }
})

export default userRouter
