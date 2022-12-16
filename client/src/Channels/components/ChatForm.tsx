import '../styles/chatForm.scss'
import { useState, useRef, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

const ChatForm = () => {
  const [input, setInput] = useState('')

  const socket: Socket<any> = io("ws://localhost:4000");

  const sendMessage = (e: any) => {
    e.preventDefault()
    socket.emit('message', 'matttarantino', 'general', input)
  }

  useEffect(() => {
    socket.on("message", (a: any, b: any, c: any) => {
      console.log(a, b, c)
    });
  }, [socket]);

  return (
    <form>
      <div className="input-group mb-3" id="ChatFormGroup">
        <input
          type="text"
          id="ChatFormInput"
          className="form-control"
          placeholder="Message"
          required
          onChange={(event) => {
            setInput(event.target.value)
          }}
        />
        <button className="btn btn-outline-primary" type="button" id="ChatFormButton" onClick={sendMessage}>
          Send
        </button>
      </div>
    </form >
  )
}

export default ChatForm
