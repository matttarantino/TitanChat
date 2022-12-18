import '../styles/chatMessage.scss'

const ChatMessage = (props: Message) => {
  const convertDateToString = () => {
    const date = new Date(props.date)

    let day = date.getDate().toString()
    let month = (date.getMonth() + 1).toString()
    const year = date.getFullYear().toString()

    if (Number(day) < 10) {
      day = '0' + day
    }

    if (Number(month) < 10) {
      month = '0' + month
    }

    let hours = date.getHours().toString()
    let minutes = date.getMinutes().toString()

    if (Number(hours) < 10) {
      hours = '0' + hours
    }

    if (Number(minutes) < 10) {
      minutes = '0' + minutes
    }

    const timeString = `${
      Number(hours) !== 0 ? Number(hours) % 12 : 12
    }:${minutes} ${Number(hours) < 12 ? 'AM' : 'PM'}`

    return `${month}/${day}/${year} at ${timeString}`
  }

  return (
    <div className="chat-message-container">
      <div className="profile-pic-container">
        <img alt="ProfilePicture" src={process.env.PUBLIC_URL + '/anon.png'} />
      </div>
      <div>
        <div className="author-container">
          <div className="author-name">{props.authorName}</div>
          <div className="message-day">{convertDateToString()}</div>
        </div>
        <div>
          {props.text && <p className="message-text">{props.text}</p>}
          {props.imageUrl && (
            <img
              className="message-image"
              alt="ImageMessage"
              src={props.imageUrl}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
