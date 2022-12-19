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
    store: { authInfo, sessionChannelInfo },
    updateStore,
  } = useStore()
  const [pageError, setPageError] = useState<RouteError | null>(null)
  const { channelId } = useParams()

  useEffect(() => {
    if (authInfo.authenticated && channelId) {
      // error check
      try {
        areValidStrings({ channelId })
      } catch (err) {
        return setPageError(httpErrors[400])
      }

      // request data from server
      console.log(
        'HERE',
        (sessionChannelInfo[channelId]?.messages ?? []).length === 0
      )
      if ((sessionChannelInfo[channelId]?.messages ?? []).length === 0)
        getPublicChannelInfo(channelId)
          .then(({ data }: { data: PublicChannel }) => {
            updateStore(
              ['sessionChannelInfo', data._id, 'messages'],
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
  ) : channelId && sessionChannelInfo[channelId] ? (
    <div className="channel-container">
      <div className="message-container-wrapper">
        {/* {channelInfo && <h1> Welcome to #{channelInfo.name}!</h1>} */}

        {/* <div className="message-container"> */}

        {(sessionChannelInfo[channelId]?.messages ?? []).map((e) => (
          <ChatMessage {...e} key={e._id} />
        ))}

        {/* </div> */}
      </div>
      <ChatForm channelId={channelId} />
    </div>
  ) : (
    <Loading />
  )
}

export default PublicChannelPage
