import { Router } from 'express'
import {
  addDirectChannel,
  getAllUserDirectChannels,
  getDirectChannelByUsernameChannelId,
  postMessageToDirectChannel,
} from '../data/directChannels'
import { ensureAuthenticated } from '../middleware/auth'
import { areValidStrings, isValidMessage } from '../utils/errors'

const directChannelsRouter = Router()

// add direct channel to users
directChannelsRouter.post('/', ensureAuthenticated, async (req, res) => {
  const {
    userFromId,
    userFromName,
    userFromProfilePhoto,
    userToId,
    userToName,
    userToProfilePhoto,
  }: DirectChannelRegistrationInfo = req.body

  try {
    areValidStrings({ userFromId, userFromName, userToId, userToName })
  } catch (err) {
    return res.status(400).send(String(err))
  }

  try {
    return res.status(200).json(
      await addDirectChannel({
        userFromId,
        userFromName,
        userFromProfilePhoto,
        userToId,
        userToName,
        userToProfilePhoto,
      })
    )
  } catch (err) {
    return res.status(500).send(String(err))
  }
})

// get all direct channels of user
directChannelsRouter.get('/:userId', ensureAuthenticated, async (req, res) => {
  const { userId } = req.params

  try {
    areValidStrings({ userId })
  } catch (err) {
    return res.status(400).send(String(err))
  }

  try {
    return res.status(200).json(await getAllUserDirectChannels(userId))
  } catch (err) {
    return res.status(500).send(String(err))
  }
})

// get direct channel info from From user
directChannelsRouter.get(
  '/:username/:channelId',
  ensureAuthenticated,
  async (req, res) => {
    const { username, channelId } = req.params

    try {
      areValidStrings({ username, channelId })
    } catch (err) {
      return res.status(400).send(String(err))
    }

    try {
      return res
        .status(200)
        .json(await getDirectChannelByUsernameChannelId(username, channelId))
    } catch (err) {
      return res.status(500).send(String(err))
    }
  }
)

directChannelsRouter.post('/message', ensureAuthenticated, async (req, res) => {
  const message: Message = req.body

  try {
    isValidMessage(message)
  } catch (err) {
    return res.status(400).send(String(err))
  }

  try {
    return res.status(200).json(await postMessageToDirectChannel(message))
  } catch (err) {
    return res.status(500).send(String(err))
  }
})

export default directChannelsRouter
