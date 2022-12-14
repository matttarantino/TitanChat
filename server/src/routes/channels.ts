import { Router } from 'express'
import { getChannelById } from '../data/channels'
import { areValidStrings } from '../utils/errors'
import { ensureAuthenticated } from '../middleware/auth'

const channelRouter = Router()

channelRouter.get('/', async (req, res) => {
  return res.status(200).json([]);
})

channelRouter.get('/:channelId', ensureAuthenticated, async (req, res) => {
  const { channelId } = req.params as any

  // error check
  try {
    areValidStrings({ channelId })
  } catch (err) {
    return res.status(400).send(String(err))
  }

  // send user data
  try {
    return res.status(200).json(await getChannelById(channelId))
  } catch (err) {
    return res.status(500).send(String(err))
  }
})

export default channelRouter
