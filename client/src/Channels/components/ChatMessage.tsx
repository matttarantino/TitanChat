import '../styles/chatMessage.scss'

const ChatMessage = (props: Message) => {
  const convertDateToString = () => {
    let date = props.date.getDate().toString()
    let month = (props.date.getMonth() + 1).toString()
    const year = props.date.getFullYear().toString()

    if (Number(date) < 10) {
      date = '0' + date
    }

    if (Number(month) < 10) {
      month = '0' + month
    }

    let hours = props.date.getHours().toString()
    let minutes = props.date.getMinutes().toString()

    if (Number(hours) < 10) {
      hours = '0' + hours
    }

    if (Number(minutes) < 10) {
      minutes = '0' + minutes
    }

    const timeString = hours + ':' + minutes

    return `${month}/${date}/${year} at ${timeString}`
  }

  return (
    <div className="ChatMessageBlock">
      <div className="ChatMessageDate">{convertDateToString()}</div>
      <div className="ChatMessageProfilePic">
        <img alt="ProfilePicture" src={process.env.PUBLIC_URL + '/anon.png'} />
      </div>
      <div className="ChatMessageAuthorName">{props.authorName}</div>
      <div className="ChatMessageContents">
        {props.text && <p>{props.text}</p>}
        <br />
        {props.imageUrl && <img alt="ImageMessage" src={props.imageUrl} />}
      </div>
    </div>
  )
}

export default ChatMessage
