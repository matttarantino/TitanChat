import { Router } from 'express'
import { getAllUsers, updateUser } from '../data/users'
import { areValidStrings } from '../utils/errors'
import { ensureAuthenticated } from '../middleware/auth'
import { ObjectId } from 'mongodb'

const userRouter = Router()

userRouter.get('/', ensureAuthenticated, async (_, res) => {
  try {
    return res.status(200).json(await getAllUsers())
  } catch (err) {
    return res.status(500).send(String(err))
  }
})

userRouter.patch(
  '/:userId',
  ensureAuthenticated,
  async (req, res) => {
    const user: UserUpdateInfo = req.body
    // error check
    try {
      // areValidStrings({ user })
      const _ = new ObjectId(user._id)
    } catch (err) {
      return res.status(400).send(String(err))
    }

    // send user data
    try {
      return res.status(200).json(await updateUser(user))
    } catch (err) {
      return res.status(500).send(String(err))
    }
  }
)

export default userRouter
