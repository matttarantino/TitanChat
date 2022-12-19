import { ObjectId } from 'mongodb'
import {
  isValidChannelName,
  areValidStrings,
  isValidMessage,
} from '../utils/errors'
import { getPublicChannelsCollection } from './config/mongoCollections'
import { getUserById, getUserByUsername } from './users'

export const createChannel = async (
  channel: PublicChannelRegistrationInfo
): Promise<PublicChannel> => {
  // error check
  try {
    areValidStrings(channel)
    isValidChannelName(channel.name)
  } catch (err) {
    throw `${String(err)}`
  }

  // check if channel name exists
  const channelNameLower = channel.name.toLowerCase()
  const publicChannels = await getPublicChannelsCollection()
  if (await publicChannels.findOne({ name: channelNameLower }))
    throw { type: 'exists', message: 'Channel is already taken.' }

  // check if user exists
  if (!(await getUserById(channel.creatorId))) throw 'Creator does not exist.'

  // add new entry to db
  channel.name = channelNameLower
  const retval = await publicChannels.insertOne({
    ...channel,
    messages: [],
  })

  if (!retval.acknowledged)
    throw `Failed to add channel ${String(channel.name)}.`

  return (await getPublicChannelById(
    String(retval.insertedId)
  )) as PublicChannel
}

export const getAllPublicChannels = async (): Promise<ChannelsResponse> => {
  const publicChannels = await getPublicChannelsCollection()
  return await publicChannels
    .find({})
    .map((e) => ({ label: e.name, channelId: String(e._id) }))
    .toArray()
}

export const getPublicChannelById = async (
  channelId: string
): Promise<PublicChannel | null> => {
  let channelIdObj

  // error check
  try {
    areValidStrings({ channelId })
    channelIdObj = new ObjectId(channelId)
  } catch (err) {
    return null
  }

  // find and return entry
  const publicChannels = await getPublicChannelsCollection()
  return (await publicChannels.findOne({ _id: channelIdObj })) as any
}

export const addMessageToChannel = async (message: Message) => {
  isValidMessage(message)

  // ensure channel exists
  if (!(await getPublicChannelById(message.channelId)))
    throw 'Channel does not exist.'

  // check if user exists
  if (!(await getUserByUsername(message.authorName)))
    throw 'User does not exist.'

  // push message to channel
  const publicChannels = await getPublicChannelsCollection()
  const ret = await publicChannels.updateOne(
    { _id: new ObjectId(message.channelId) },
    {
      $push: {
        messages: {
          $each: [message],
          $position: 0,
        },
      },
    }
  )

  if (ret.modifiedCount !== 1) throw 'Channel update failed.'

  return await getPublicChannelById(message.channelId)
}
