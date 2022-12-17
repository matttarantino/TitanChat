/**
 * @author rgorai
 * @description schema for a message
 * @param authorName username of the user that sent the message
 * @param channelId is of the channel in which the message was sent
 * @param date stringified date object specifying when the message was sent
 * @param text message text, if any
 * @param imageUrl s3 url of the image, if any
 */
type Message = {
  _id: string
  authorName: string
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
 * @description schema for a direct message channel between two users
 * @param userAId id of the first user
 * @param userAName username of the first user
 * @param userBId id of the second user
 * @param userBName username of the second user
 * @param messages array of {@link Message}s that are part of this channel
 */
type DmChannel = {
  _id: string
  userAId: string
  userAName: string
  userBId: string
  userBName: string
  messages: Array<Message>
}

/**
 * @author rgorai
 * @description response schema for requesting all public/direct channels
 * @param label channel's display label
 * @param channelId channels id to link to
 */
type ChannelsResponse = Array<{
  label: string
  channelId: string
}>
