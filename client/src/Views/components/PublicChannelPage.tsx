import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ChatForm from '../../Channels/components/ChatForm'
import ChatMessage from '../../Channels/components/ChatMessage'
import ErrorPage from '../../Misc/components/ErrorPage'
import Loading from '../../Misc/components/Loading'
import { useStore } from '../../services/appStore'
import { getPublicChannelInfo } from '../../services/privateServices'
import { joinChannel, leaveChannel } from '../../services/sockets'
import { areValidStrings, httpErrors } from '../../utils/errors'
import '../styles/channelPage.scss'

const PublicChannelPage = () => {
  const {
    store: { authInfo, sessionMessages },
  } = useStore()
  const [channelInfo, setChannelInfo] = useState<PublicChannel | null>(null)
  const [pageError, setPageError] = useState<RouteError | null>(null)
  const { channelId } = useParams()
  const roomMessages = sessionMessages.filter((e) => e.channelId === channelId)

  useEffect(() => {
    if (authInfo.authenticated && channelId) {
      // error check
      try {
        areValidStrings({ channelId })
      } catch (err) {
        return setPageError(httpErrors[400])
      }

      // request data from server
      getPublicChannelInfo(channelId)
        .then(({ data }) => {
          console.log('channel data', data)
          setChannelInfo(data)
        })
        .catch(({ response }) => {
          console.error('channel error', response)
          setPageError(response)
        })

      // join socket channel
      joinChannel(authInfo.username, channelId)

      // cleanup
      return () => {
        setChannelInfo(null)
        setPageError(null)
        leaveChannel(authInfo.username, channelId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  return pageError ? (
    <ErrorPage {...pageError} />
  ) : (roomMessages.length > 0 || channelInfo) && channelId ? (
    <div className="channel-container">
      <div className="message-container-wrapper">
        {/* {channelInfo && <h1> Welcome to #{channelInfo.name}!</h1>} */}

        {/* <div className="message-container"> */}
        {[...roomMessages, ...(channelInfo?.messages.reverse() ?? [])].map(
          (e) => (
            <ChatMessage {...e} key={e._id} />
          )
        )}
        {/* </div> */}
      </div>
      <ChatForm channelId={channelId} />
    </div>
  ) : (
    <Loading />
  )
}

export default PublicChannelPage
