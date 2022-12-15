import '../styles/chatForm.scss'
import { useState } from 'react'

const ChatForm = () => {
  const [input, setInput] = useState('')

  const sendMessage = () => {
    // Socket Stuff
  }

  return (
    <form>
      chat form
      <div id="ChatFormGroup">
        <label>
          <input
            type="text"
            id="ChatFormInput"
            placeholder="Message"
            required
            onChange={(event) => {
              setInput(event.target.value)
            }}
          />
        </label>
      </div>
      <button id="ChatFormButton" onClick={sendMessage}>
        Send
      </button>
    </form>
  )
}

export default ChatForm
