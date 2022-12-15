import { getChannelsCollection } from './config/mongoCollections'
import { ObjectId } from 'mongodb'
import { isValidChannelName, areValidStrings } from '../utils/errors'

export const createChannel = async (
  channel: ChannelRegistrationInfo
): Promise<PublicChannel> => {
  // error check
  try {
    isValidChannelName(channel.name)
  } catch (err) {
    throw `DB Error: ${String(err)}`
  }

  // check if username exists
  const channelNameLower = channel.name.toLowerCase()
  const channelsCollection = await getChannelsCollection()
  if (await channelsCollection.findOne({ channelNameLower }))
    throw 'Channel is already taken.'

  channel.name = channelNameLower;
  // add new entry to db
  const retval = await channelsCollection.insertOne({
    ...channel,
    messages: [],
  })
  if (!retval.acknowledged)
    throw `DB Error: failed to add channel ${String(channel)}.`
  return (await getChannelById(String(retval.insertedId))) as PublicChannel
}

export const getAllChannels = async (): Promise<Array<ChannelsResponse>> => {
  const channelsCollection = await getChannelsCollection()
  return (await channelsCollection
    .find({})
    .map((e) => ({ ...e, _id: String(e._id) }))
    .toArray()) as any
}

export const getChannelById = async (channelId: string): Promise<PublicChannel | null> => {
  let channelIdObj

  // error check
  try {
    areValidStrings({ channelId })
    channelIdObj = new ObjectId(channelId)
  } catch (err) {
    return null
  }

  // find and return entry
  const channelsCollection = await getChannelsCollection();
  const channel = (await channelsCollection.findOne({ _id: channelIdObj })) as any
  return channel ? channel : null
}


