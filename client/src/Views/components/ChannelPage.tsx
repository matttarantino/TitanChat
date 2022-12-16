import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ChatForm from '../../Channels/components/ChatForm'
import ErrorPage from '../../Misc/components/ErrorPage'
import Loading from '../../Misc/components/Loading'
import { getPublicChannelInfo } from '../../services/privateServices'
import { areValidStrings, httpErrors } from '../../utils/errors'
import '../styles/channelPage.scss'

const ChannelPage = () => {
  const [pageData, setPageData] = useState<Array<PublicChannel> | null>(null)
  const [pageError, setPageError] = useState<RouteError | null>(null)
  const { channelId } = useParams()

  useEffect(() => {
    // error check
    try {
      areValidStrings({ channelId })
    } catch (err) {
      return setPageError(httpErrors[400])
    }

    // request data from server
    getPublicChannelInfo(channelId as string)
      .then(({ data }) => {
        console.log('channel data', data)
        setPageData(data)
      })
      .catch(({ response }) => {
        console.error('channel error', response)
        setPageError(response)
      })

    // cleanup
  }, [channelId])

  return pageError ? (
    <ErrorPage {...pageError} />
  ) : pageData && channelId ? (
    <div className="channel-container">
      <div className="message-container">channel messages</div>
      <ChatForm channelId={channelId} />
    </div>
  ) : (
    <div>
      <Loading />
    </div>
  )
}

export default ChannelPage
