import '../styles/chatForm.scss'
import { useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { v4 as uuidv4 } from 'uuid'
import { BUCKET_URL, uploadFile } from '../../services/s3Service'
import { useStore } from '../../services/appStore'
import { emitMessage } from '../../services/sockets'

type Props = {
  channelId: string
}

const ChatForm = (props: Props) => {
  const {
    store: { authInfo },
  } = useStore()
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const sendMessage = () => {
    // send message to server
  }

  const onSubmit = (ev: any) => {
    ev.preventDefault()
    // Socket Stuff

    if (authInfo.authenticated) {
      const newMessage: Message = {
        _id: uuidv4(),
        authorName: authInfo.username,
        channelId: props.channelId,
        date: new Date(),
        text: message.trim().length > 0 ? message.trim() : null,
        imageUrl: image ? `${BUCKET_URL}/channels/${uuidv4()}` : null,
      }

      if (image && newMessage.imageUrl) {
        const imagePath = uuidv4()
        uploadFile(image, imagePath)
          .then((res) => {
            console.log('upload success', res)
            emitMessage(newMessage)

            // reset inputs
            setMessage('')
            setImage(null)
              ; (imageInputRef.current as HTMLInputElement).value = ''
          })
          .catch((err) => {
            console.error('aws upload error', err)
          })
      } else if (newMessage.text) {
        emitMessage(newMessage)
        setMessage('')
      }
    }
  }

  return (
    <Form className="chat-form" onSubmit={onSubmit}>
      < hr />
      <FloatingLabel label="Send a message" controlId="message-input">
        <Form.Control
          className="chat-input"
          as="textarea"
          onChange={(event) => {
            setMessage(event.target.value)
          }}
          value={message}
          placeholder="placeholder"
        />
      </FloatingLabel>

      <div className="chat-button-bar">
        <Form.Control
          className="file-input"
          type="file"
          accept="image/*"
          onChange={(ev) => setImage((ev.target as any).files[0])}
          ref={imageInputRef}
        />

        <Button
          type="submit"
          disabled={(message ? message.trim().length === 0 : true) && !image}
        >
          Send
        </Button>
      </div>
    </Form>
  )
}

export default ChatForm
