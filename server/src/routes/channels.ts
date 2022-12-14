import { Router } from 'express'
import channels from '../data/channels'
import { areValidStrings } from '../utils/errors'
// import { ensureAuthenticated } from '../middleware/auth'

const channelRouter = Router()

channelRouter.get('/', async (req, res) => {
  return res.status(200).json(channels);
})

channelRouter.get('/:channel_id', async (req, res) => {
  return res.status(200).json('hello tino');
})

export default channelRouter
