import { ObjectId } from 'mongodb'
import { areValidStrings, isValidChannelName } from '../utils/errors'
import { getDirectChannelsCollection } from './config/mongoCollections'
import { getUserById } from './users'

export const addDirectChannel = async (
  channel: DirectChannelRegistrationInfo
) => {
  // error check
  try {
    areValidStrings(channel)
  } catch (err) {
    throw String(err)
  }

  // check if From user exists
  if (!(await getUserById(channel.userFromId)))
    throw 'From user does not exist.'

  // check if dm is already started with To user
}

export const getAllDirectChannels = async (): Promise<ChannelsResponse> => {
  const directChannels = await getDirectChannelsCollection()
  return await directChannels
    .find({})
    .map((e) => ({ label: e.userToName, channelId: String(e._id) }))
    .toArray()
}

export const getDirectChannelById = async (
  channelId: string
): Promise<DirectChannel | null> => {
  let channelIdObj

  // error check
  try {
    areValidStrings({ channelId })
    channelIdObj = new ObjectId(channelId)
  } catch (err) {
    return null
  }

  // find and return entry
  const directChannels = await getDirectChannelsCollection()
  return (await directChannels.findOne({ _id: channelIdObj })) as any
}
