import { getChannelsCollection } from './config/mongoCollections'
import { ObjectId } from 'mongodb'
import { areValidStrings } from '../utils/errors'

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
