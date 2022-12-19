import { Router } from 'express'
import { updateUser } from '../data/users'
import { areValidStrings } from '../utils/errors'
import { ensureAuthenticated } from '../middleware/auth'
import { ObjectId } from 'mongodb'

const profileRouter = Router()

profileRouter.patch(
  '/',
  ensureAuthenticated,
  async (req, res) => {
    const user: UserUpdateInfo = req.body
    // error check
    try {
      // is this going to get caught on the missing URL?
      // areValidStrings(user)
      const _ = new ObjectId(user._id)
    } catch (err) {
      return res.status(400).send(String(err))
    }

    // send user data
    try {
      return res.status(200).json(await updateUser(user))
    } catch (err) {
      console.log(err)
      return res.status(500).send(String(err))
    }
  }
)

export default profileRouter
