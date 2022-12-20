import { Router } from 'express'
import { getAllUsers } from '../data/users'
import { ensureAuthenticated } from '../middleware/auth'

const userRouter = Router()

userRouter.get('/', ensureAuthenticated, async (_, res) => {
  try {
    return res.status(200).json(await getAllUsers())
  } catch (err) {
    return res.status(500).send(String(err))
  }
})

export default userRouter
