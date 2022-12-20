/**
 * @author rgorai
 * @description schema for a message
 * @param _id client-created uuid of the message
 * @param authorName username of the user that sent the message
 * @param channelId is of the channel in which the message was sent
 * @param date stringified date object specifying when the message was sent
 * @param text message text, if any
 * @param imageUrl s3 url of the image, if any
 */
type Message = {
  _id: string
  authorName: string
  authorProfilePhoto: string | null | undefined
  channelId: string
  date: string
  text: string | null
  imageUrl: string | null
}

/**
 * @author rgorai
 * @description schema for a public channel
 * @param name name of the channel
 * @param creatorId id of the user that created the channel
 * @param messages array of {@link Message}s that are part of this channel
 */
type PublicChannel = {
  _id: string
  name: string
  creatorId: string
  messages: Array<Message>
}

/**
 * @author matttarantino
 * @description the data to create a public channel. See
 *              {@link PublicChannel} for param descriptions.
 */
type PublicChannelRegistrationInfo = Omit<PublicChannel, '_id' | 'messages'>

/**
 * @author rgorai
 * @description response schema for requesting all public channels
 * @param label channel's display label
 * @param channelId channels id to link to
 */
type PublicChannelsResponse = Array<{
  label: string
  channelId: string
}>

/**
 * @author rgorai
 * @description schema for a direct message channel between two users
 * @param userFromId id of the first user
 * @param userFromName username of the first user
 * @param userFromProfilePhoto profile picture of the first user
 * @param userToId id of the second user
 * @param userToName username of the second user
 * @param userToProfilePhoto profile picture of the second user
 * @param messages array of {@link Message}s that are part of this channel
 */
type DirectChannel = {
  _id: string
  userFromId: string
  userFromName: string
  userFromProfilePhoto: string | null
  userToId: string
  userToName: string
  userToProfilePhoto: string | null
  messages: Array<Message>
}

/**
 * @author rgorai
 * @description the data to create a direct channel. See
 *              {@link DirectChannel} for param descriptions.
 */
type DirectChannelRegistrationInfo = Omit<DirectChannel, '_id' | 'messages'>

/**
 * @author rgorai
 * @description response schema for requesting all direct channels
 * @param channelId channels id to link to
 * @param userToName username of the user the dm is with
 * @param userToProfilePhoto profile photo of the user the dm is with
 */
type DirectChannelsResponse = Array<{
  channelId: string
  userToName: string
  userToProfilePhoto: string | null
}>
