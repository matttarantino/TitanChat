import ChatMessage from './ChatMessage'
import '../styles/chatList.scss'

const ChatList = (props: SessionChannelInfo[string]) => (
  <div className="message-container-wrapper">
    {/* {channelInfo && <h1> Welcome to #{channelInfo.name}!</h1>} */}

    {/* <div className="message-container"> */}

    {(props?.messages ?? []).map((e) => (
      <ChatMessage {...e} key={e._id} />
    ))}

    {/* </div> */}
  </div>
)

export default ChatList
