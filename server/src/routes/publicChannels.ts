import { Router } from 'express'
import { ObjectId } from 'mongodb'
import {
  getAllPublicChannels,
  getPublicChannelById,
} from '../data/publicChannels'
import { areValidStrings } from '../utils/errors'
import { ensureAuthenticated } from '../middleware/auth'

const publicChannelsRouter = Router()

publicChannelsRouter
  .route('/')
  .get(ensureAuthenticated, async (_, res) => {
    return res.status(200).json(await getAllPublicChannels())
  })

publicChannelsRouter.get(
  '/:channelId',
  ensureAuthenticated,
  async ({ params: { channelId } }, res) => {
    // error check
    try {
      areValidStrings({ channelId })
      const _ = new ObjectId(channelId)
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
