import { Router } from 'express'
import {
  createChannel,
  getAllPublicChannels,
  getPublicChannelById,
} from '../data/publicChannels'
import { areValidStrings } from '../utils/errors'
import { ensureAuthenticated } from '../middleware/auth'

const publicChannelsRouter = Router()

publicChannelsRouter
  .route('/')
  .get(ensureAuthenticated, async (req, res) => {
    return res.status(200).json(await getAllPublicChannels())
  })
  .post(ensureAuthenticated, async (req, res) => {
    const { name, creatorId } = req.body

    try {
      areValidStrings({ name, creatorId })
    } catch (err) {
      return res.status(400).send(String(err))
    }

    try {
      return res.status(200).json(await createChannel({ name, creatorId }))
    } catch (err: any) {
      if (err.type === 'exists') return res.status(409).send(err.message)
      else return res.status(500).send(String(err))
    }
  })

publicChannelsRouter.get(
  '/:channelId',
  ensureAuthenticated,
  async ({ params: { channelId } }, res) => {
    // error check
    try {
      areValidStrings({ channelId })
    } catch (err) {
      return res.status(400).send(String(err))
    }

    // send user data
    try {
      return res.status(200).json(await getPublicChannelById(channelId))
    } catch (err) {
      return res.status(500).send(String(err))
    }
  }
)

export default publicChannelsRouter
