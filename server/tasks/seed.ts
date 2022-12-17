import { createChannel } from '../src/data/publicChannels'
import { createUser } from '../src/data/users'
;(async () => {
  const UserRegistrationInfo = {
    username: 'system',
    password: 'Password1!',
  }

  const user = await createUser(UserRegistrationInfo)

  const PublicChannelRegistrationInfo1 = {
    name: 'general',
    creatorId: user._id,
  }
  const PublicChannelRegistrationInfo2 = {
    name: 'cs-554',
    creatorId: user._id,
  }
  const PublicChannelRegistrationInfo3 = {
    name: 'random',
    creatorId: user._id,
  }
  const PublicChannelRegistrationInfo4 = {
    name: 'cs-546',
    creatorId: user._id,
  }

  await createChannel(PublicChannelRegistrationInfo1)
  await createChannel(PublicChannelRegistrationInfo2)
  await createChannel(PublicChannelRegistrationInfo3)
  await createChannel(PublicChannelRegistrationInfo4)

  console.log('Done seeding.')
})().catch((err) => {
  console.log('seed error', err)
})
