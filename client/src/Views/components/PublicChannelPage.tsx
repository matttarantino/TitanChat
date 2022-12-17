import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ChatForm from '../../Channels/components/ChatForm'
import ChatMessage from '../../Channels/components/ChatMessage'
import ErrorPage from '../../Misc/components/ErrorPage'
import Loading from '../../Misc/components/Loading'
import { useStore } from '../../services/appStore'
import { getPublicChannelInfo } from '../../services/privateServices'
import {
  disconnectSocket,
  joinChannel,
  leaveChannel,
  onMessageReceived,
} from '../../services/sockets'
import { areValidStrings, httpErrors } from '../../utils/errors'
import '../styles/channelPage.scss'

const PublicChannelPage = () => {
  const {
    store: { authInfo },
  } = useStore()
  const [pageData, setPageData] = useState<Array<PublicChannel> | null>(null)
  const [sessionMessages, setSessionMessages] = useState<Array<Message>>([
    {
      _id: 'messageid',
      authorName: 'randomauthor',
      channelId: '639c119821e20332f47ce553',
      date: String(new Date()),
      // text: null,
      text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
      // imageUrl: null,
      imageUrl:
        'https://media.istockphoto.com/id/1222803633/photo/colorful-sunrise-over-the-beach-at-holgate-nj.jpg?s=612x612&w=0&k=20&c=4gdJ6ERw_dMjDU7h3yykM9lyZsFrTk-0Vf1MdN583w4=',
    },
  ])
  const [pageError, setPageError] = useState<RouteError | null>(null)
  const { channelId } = useParams()

  // useEffect(() => {
  //   // set message listener
  //   onMessageReceived(({ messageData }) => {
  //     console.log('received', messageData)
  //     if (messageData.channelId === channelId)
  //       // console.log('message received', messageData)
  //       setSessionMessages((prev) => [messageData, ...prev])
  //   })
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
          setPageData(data)
        })
        .catch(({ response }) => {
          console.error('channel error', response)
          setPageError(response)
        })

      // join socket channel
      joinChannel(authInfo.username, channelId)

      // set message listener
      onMessageReceived(({ messageData }) => {
        console.log('received', messageData)
        if (messageData.channelId === channelId)
          // console.log('message received', messageData)
          setSessionMessages((prev) => [messageData, ...prev])
      })

      // cleanup
      return () => {
        setPageData(null)
        setPageError(null)
        leaveChannel(authInfo.username, channelId)
        // disconnectSocket()
        // setSessionMessages([])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  useEffect(() => {
    // console.log('here', sessionMessages)
  }, [sessionMessages])

  return pageError ? (
    <ErrorPage {...pageError} />
  ) : pageData && channelId ? (
    <div className="channel-container">
      <div className="message-container-wrapper">
        {/* <div className="message-container"> */}
        {sessionMessages
          .filter((e) => e.channelId === channelId)
          .map((e) => (
            <ChatMessage {...e} key={String(e.date)} />
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
