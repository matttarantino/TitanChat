import { createPublicChannel } from '../src/data/publicChannels'
import { createUser } from '../src/data/users'
import { closeConnection } from '../src/data/config/mongoConnection'
;(async () => {
  const UserRegistrationInfo = {
    username: 'system',
    password: 'Password1!',
    profilePhotoUrl: null,
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

  await createPublicChannel(PublicChannelRegistrationInfo1)
  await createPublicChannel(PublicChannelRegistrationInfo2)
  await createPublicChannel(PublicChannelRegistrationInfo3)
  await createPublicChannel(PublicChannelRegistrationInfo4)

  console.log('Done seeding.')
  closeConnection()
})().catch((err) => {
  console.log('seed error', err)
})
