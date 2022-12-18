import { ObjectId } from 'mongodb'
import { isValidChannelName, areValidStrings } from '../utils/errors'
import { getPublicChannelsCollection } from './config/mongoCollections'
import { getUser } from './users'

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
  const publicChannelsCollection = await getPublicChannelsCollection()
  if (await publicChannelsCollection.findOne({ name: channelNameLower }))
    throw { type: 'exists', message: 'Channel is already taken.' }

  // check if user exists
  if (!(await getUser(channel.creatorId))) throw 'Creator does not exist.'

  // add new entry to db
  channel.name = channelNameLower
  const retval = await publicChannelsCollection.insertOne({
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
  const publicChannelsCollection = await getPublicChannelsCollection()
  return await publicChannelsCollection
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
  const publicChannelsCollection = await getPublicChannelsCollection()
  return (await publicChannelsCollection.findOne({ _id: channelIdObj })) as any
}
