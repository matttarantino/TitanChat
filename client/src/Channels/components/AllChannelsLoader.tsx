import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Loading from '../../Misc/components/Loading'
import { useStore } from '../../services/appStore'
import {
  getDirectChannels,
  getPublicChannels,
} from '../../services/privateServices'

const AllChannelsLoader = () => {
  const {
    store: { authInfo, sessionChannelInfo },
    updateStore,
  } = useStore()

  useEffect(() => {
    if (authInfo.authenticated) {
      getPublicChannels()
        .then(({ data }: { data: PublicChannelsResponse }) => {
          console.log('got public messages', data)
          updateStore(
            ['sessionChannelInfo', 'public'],
            data.reduce(
              (p, c) => ({
                ...p,
                [c.channelId]: {
                  name: c.label,
                  messages: [],
                },
              }),
              {}
            )
          )
        })
        .catch(({ response }) => {
          console.error('channel load error', response)
        })

      getDirectChannels(authInfo.userId)
        .then(({ data }: { data: DirectChannelsResponse }) => {
          console.log('got direct messages', data)
          updateStore(
            ['sessionChannelInfo', 'direct'],
            data.reduce(
              (p, c) => ({
                ...p,
                [c.channelId]: {
                  name: c.userToName,
                  messages: [],
                  channelIcon: c.userToProfilePhoto,
                },
              }),
              {}
            )
          )
        })
        .catch(({ response }) => {
          console.error('direct channel load error', response)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (authInfo.authenticated &&
    sessionChannelInfo.public &&
    sessionChannelInfo.direct) ||
    !authInfo.authenticated ? (
    <Outlet />
  ) : (
    <Loading />
  )
}

export default AllChannelsLoader
