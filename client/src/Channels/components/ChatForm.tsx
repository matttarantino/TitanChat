import '../styles/chatForm.scss'
import { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { v4 as uuidv4 } from 'uuid'
import { io, Socket } from 'socket.io-client'
import { uploadFile } from '../../services/s3Service'

const ChatForm = () => {
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [inputError, setInputError] = useState('')

  const sendMessage = () => {
    // Socket Stuff

    if (message.trim().length === 0 && !image)
      return setInputError('You must provide a message or image.')

    if (image) {
      const imagePath = uuidv4()
      uploadFile(image, imagePath)
        .then((res) => {
          console.log('upload success', res)
        })
        .catch((err) => {
          console.error('aws upload error', err)
        })
    }
  }

  useEffect(() => {
    console.log('image', image)
  }, [image])

  return (
    <Form className="message-form">
      <FloatingLabel label="Send a message" controlId="message-input">
        <Form.Control
          className="message-input"
          as="textarea"
          onChange={(event) => {
            setMessage(event.target.value)
          }}
          placeholder="placeholder"
        />
      </FloatingLabel>
      <div className="message-button-bar">
        <Form.Control
          className="file-input"
          type="file"
          accept="image/*"
          onChange={(ev) => setImage((ev.target as any).files[0])}
        />

        {inputError && (
          <Form.Group className="form-error">{inputError}</Form.Group>
        )}

        <Button
          onClick={sendMessage}
          disabled={message.trim().length === 0 && !image}
        >
          {/* const socket: Socket<any> = io("ws://localhost:4000");

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
        <button className="btn btn-outline-primary" type="button" id="ChatFormButton" onClick={sendMessage}> */}
          Send
        </Button>
      </div>
    </Form>
  )
}

export default ChatForm
