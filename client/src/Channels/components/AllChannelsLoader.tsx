import { PropsWithChildren, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Loading from '../../Misc/components/Loading'
import { useStore } from '../../services/appStore'
import { getPublicChannels } from '../../services/privateServices'
import {
  onMessageReceived,
  refreshPublicChannels,
} from '../../services/sockets'

const AllChannelsLoader = () => {
  const {
    store: { authInfo, sessionChannelInfo },
    updateStore,
  } = useStore()

  useEffect(() => {
    if (authInfo.authenticated) {
      getPublicChannels()
        .then(({ data }: { data: ChannelsResponse }) => {
          console.log('channel loader', data)
          updateStore(
            'sessionChannelInfo',
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

      // set up message listener
      onMessageReceived((messageData) => {
        console.log('message received', messageData)
        updateStore(
          ['sessionChannelInfo', messageData.channelId, 'messages'],
          messageData,
          true
        )
      })

      // set up public channel refresh listener
      refreshPublicChannels((channelInfo) => {
        console.log('channel added', channelInfo)
        updateStore(['sessionChannelInfo', channelInfo._id], {
          name: channelInfo.name,
          messages: [],
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authInfo.authenticated])

  return authInfo.authenticated &&
    Object.keys(sessionChannelInfo).length === 0 ? (
    <Loading />
  ) : (
    <Outlet />
  )
}

export default AllChannelsLoader
