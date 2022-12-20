import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ChatForm from '../../Channels/components/ChatForm'
import ChatList from '../../Channels/components/ChatList'
import ErrorPage from '../../Misc/components/ErrorPage'
import Loading from '../../Misc/components/Loading'
import { useStore } from '../../services/appStore'
import {
  getDirectChannelInfo,
  getPublicChannelInfo,
} from '../../services/privateServices'
import { joinChannel, leaveChannel } from '../../services/sockets'
import { areValidStrings, httpErrors } from '../../utils/errors'
import '../styles/channelPage.scss'

type Props = {
  channelType: 'public' | 'direct'
  paramName: string
}

const ChannelPage = (props: Props) => {
  const {
    store: { authInfo, sessionChannelInfo },
    updateStore,
  } = useStore()
  const [pageError, setPageError] = useState<RouteError | null>(null)
  const { [props.paramName]: channelId } = useParams()

  useEffect(() => {
    if (authInfo.authenticated && channelId) {
      // error check
      try {
        areValidStrings({ channelId })
      } catch (err) {
        return setPageError(httpErrors[400])
      }

      // request data from server
      if (
        (sessionChannelInfo[props.channelType]?.[channelId]?.messages ?? [])
          .length === 0
      )
        (props.channelType === 'public'
          ? getPublicChannelInfo(channelId)
          : getDirectChannelInfo(authInfo.username, channelId)
        )
          .then(({ data }) => {
            console.log(props.channelType, 'channel data', data)
            updateStore(
              ['sessionChannelInfo', props.channelType, data._id, 'messages'],
              data.messages
            )
          })
          .catch(({ response }) => {
            setPageError(response)
          })

      // join socket channel
      joinChannel(authInfo.username, channelId)

      // cleanup
      return () => {
        setPageError(null)
        leaveChannel(authInfo.username, channelId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  return pageError ? (
    <ErrorPage {...pageError} />
  ) : channelId && sessionChannelInfo[props.channelType]?.[channelId] ? (
    <div className="channel-container">
      <ChatList
        {...(sessionChannelInfo[props.channelType]?.[
          channelId
        ] as SessionChannelInfo[string])}
      />
      <ChatForm channelId={channelId} channelType={props.channelType} />
    </div>
  ) : (
    <Loading />
  )
}

export default ChannelPage
