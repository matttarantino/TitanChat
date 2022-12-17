import { createChannel } from '../src/data/publicChannels'
import { createUser } from '../src/data/users'

  ; (async () => {
    let UserRegistrationInfo = {
      username: 'system',
      password: 'Password1!'
    }

    let user = await createUser(UserRegistrationInfo)

    let PublicChannelRegistrationInfo1 = {
      name: 'general',
      creatorId: user._id
    }
    let PublicChannelRegistrationInfo2 = {
      name: 'cs-554',
      creatorId: user._id
    }
    let PublicChannelRegistrationInfo3 = {
      name: 'random',
      creatorId: user._id
    }
    let PublicChannelRegistrationInfo4 = {
      name: 'cs-546',
      creatorId: user._id
    }

    await createChannel(PublicChannelRegistrationInfo1)
    await createChannel(PublicChannelRegistrationInfo2)
    await createChannel(PublicChannelRegistrationInfo3)
    await createChannel(PublicChannelRegistrationInfo4)
  })().catch((err) => {
    console.log('seed error', err)
  })
