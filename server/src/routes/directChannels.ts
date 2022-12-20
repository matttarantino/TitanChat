import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { ensureAuthenticated } from '../middleware/auth'

const directChannelsRouter = Router()

directChannelsRouter.route('/').get(ensureAuthenticated, async (req, res) => {
  // return
})

export default directChannelsRouter
