/**
 * @author rgorai
 * @description schema for a message
 * @param channelId id of the channel the message was sent to
 * @param authorName username of the authoring user
 * @param date date that the message was sent
 * @param text message text, if any
 * @param imageUrl url of the image associated with the message, if any
 * @note at least one between text and imageUrl must be present
 */
type Message = {
  _id: string
  authorName: string
  channelId: string
  date: Date
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
type ChannelRegistrationInfo = Omit<PublicChannel, '_id' | 'messages'>

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
 * @description response schema for requesting all channels
 * @param label channel's display label
 * @param channelId channels id to link to
 */
type ChannelsResponse = Array<{
  label: string
  channelId: string
}>
