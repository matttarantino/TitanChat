import { ObjectId } from 'mongodb'
import { areValidStrings, isValidMessage } from '../utils/errors'
import { getUsersCollection } from './config/mongoCollections'
import { getUserById, getUserByUsername } from './users'

export const addDirectChannel = async ({
  userFromId,
  userFromName,
  userFromProfilePhoto,
  userToId,
  userToName,
  userToProfilePhoto,
}: DirectChannelRegistrationInfo) => {
  // error check
  areValidStrings({ userFromId, userFromName, userToId, userToName })

  // check if From user exists
  const fromUser = await getUserById(userFromId)
  if (!fromUser) throw 'From user does not exist.'

  // check if To user exists
  if (!(await getUserById(userToId))) throw 'To user does not exist.'

  // check if dm is already started with To user
  if (fromUser.directMessages.find((e) => e.userToId === userToId))
    throw 'Direct message with To user already exists.'

  // add direct channel to From user
  const users = await getUsersCollection()
  const newChannelId = String(new ObjectId())
  users.updateOne(
    { _id: new ObjectId(userFromId) },
    {
      $push: {
        directMessages: {
          _id: newChannelId,
          userFromId,
          userFromName,
          userFromProfilePhoto,
          userToId,
          userToName,
          userToProfilePhoto,
          messages: [],
        },
      },
    }
  )

  // add direct channel to To user
  users.updateOne(
    { _id: new ObjectId(userToId) },
    {
      $push: {
        directMessages: {
          _id: newChannelId,
          userFromId: userToId,
          userFromName: userToName,
          userFromProfilePhoto: userToProfilePhoto,
          userToId: userFromId,
          userToName: userFromName,
          userToProfilePhoto: userFromProfilePhoto,
          messages: [],
        },
      },
    }
  )

  return await getDirectChannelByUsernameChannelId(userFromId, newChannelId)
}

export const getAllUserDirectChannels = async (
  userFromId: string
): Promise<DirectChannelsResponse> => {
  // ensure user exists
  const user = await getUserById(userFromId)
  if (!user) throw 'From user does not exist.'

  // return mapped data
  return user.directMessages.map((e) => ({
    channelId: String(e._id),
    userToName: e.userToName,
    userToProfilePhoto: e.userToProfilePhoto,
  }))
}

export const getDirectChannelByUsernameChannelId = async (
  userFromName: string,
  channelId: string
): Promise<DirectChannel | null> => {
  // error check
  try {
    areValidStrings({ userFromName, channelId })
    const _ = new ObjectId(channelId)
  } catch (err) {
    return null
  }

  // ensure user exists
  const user = await getUserByUsername(userFromName)
  if (!user) throw 'From user does not exist.'

  // find and return entry
  return user.directMessages.find((e) => e._id === channelId) ?? null
}

export const postMessageToDirectChannel = async (message: Message) => {
  // ensure channel exists
  const channel = await getDirectChannelByUsernameChannelId(
    message.authorName,
    message.channelId
  )
  if (!channel) throw 'Channel does not exist.'

  // check if user exists
  if (!(await getUserByUsername(message.authorName)))
    throw 'User does not exist.'

  // push message to From user
  const users = await getUsersCollection()
  const retFrom = await users.updateOne(
    { _id: new ObjectId(channel.userFromId) },
    {
      $push: {
        directMessages: {
          messages: {
            $each: [message],
            $position: 0,
          },
        },
      },
    }
  )

  if (retFrom.modifiedCount !== 1) throw 'Channel update failed.'

  // push message to To user
  const retTo = await users.updateOne(
    { _id: new ObjectId(channel.userToId) },
    {
      $push: {
        directMessages: {
          messages: {
            $each: [message],
            $position: 0,
          },
        },
      },
    }
  )

  if (retTo.modifiedCount !== 1) throw 'Channel update failed.'

  return await getDirectChannelByUsernameChannelId(
    message.authorName,
    message.channelId
  )
}
