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
      const { profilePhotoUrl, ...requiredInfo } = user
      areValidStrings(requiredInfo)
      const _ = new ObjectId(user._id)
    } catch (err) {
      return res.status(400).send(String(err))
    }

    // send user data
    try {
      return res.status(200).json(await updateUser(user))
    } catch (err: any) {
      if (err.type === 'exists') return res.status(409).send(err.message)
      return res.status(500).send(String(err))
    }
  }
)

export default profileRouter
