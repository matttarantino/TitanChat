import '../styles/chatForm.scss'
import { useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { v4 as uuidv4 } from 'uuid'
import { uploadFile } from '../../services/s3Service'
import { useStore } from '../../services/appStore'
import { emitMessage } from '../../services/sockets'
import {
  postMessageDirectChannel,
  postMessagePublicChannel,
} from '../../services/privateServices'

type Props = {
  channelId: string
  channelType: 'public' | 'direct'
}

const ChatForm = (props: Props) => {
  const {
    store: { authInfo },
  } = useStore()
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [sendDisabled, setSendDisabled] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)
  const textInputRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // enables sending when input is received
  useEffect(() => {
    setSendDisabled(!(message.trim().length > 0 || image))
  }, [message, image])

  useEffect(() => {
    textInputRef?.current?.focus?.()
  }, [])

  // submits the form when ctrl + enter is pressed in the text input
  const onTextKeydown = (ev: React.KeyboardEvent) => {
    if (ev.repeat) return
    if (ev.code === 'Enter' && ev.ctrlKey) formRef.current?.requestSubmit()
  }

  const sendMessage = (newMessage: Message) => {
    emitMessage(newMessage)
    if (props.channelType === 'public')
      postMessagePublicChannel(newMessage).catch(({ response }) => {
        console.error('message post error', response)
      })
    else
      postMessageDirectChannel(newMessage).catch(({ response }) => {
        console.error('message post error', response)
      })
  }

  const onSubmit = (ev: any) => {
    ev.preventDefault()

    if (authInfo.authenticated && !sendDisabled) {
      setSendDisabled(true)

      const newMessage: Message = {
        _id: uuidv4(),
        authorName: authInfo.username,
        authorProfilePhoto: authInfo.userProfilePhoto,
        channelId: props.channelId,
        channelType: props.channelType,
        date: String(new Date()),
        text: message.trim().length > 0 ? message.trim() : null,
        imageUrl: null,
      }

      if (image) {
        uploadFile(image, 'channels', image.name)
          .then((imageUrl) => {
            sendMessage({ ...newMessage, imageUrl })

            // reset inputs
            setMessage('')
            setImage(null)
            ;(imageInputRef.current as HTMLInputElement).value = ''
          })
          .catch((err) => {
            console.error('aws upload error', err)
          })
      } else if (newMessage.text) {
        sendMessage(newMessage)
        setMessage('')
      }
    }
  }

  return (
    <Form className="chat-form" onSubmit={onSubmit} ref={formRef}>
      <FloatingLabel
        label="Send a message (ctrl + enter)"
        controlId="message-input"
      >
        <Form.Control
          className="chat-input"
          as="textarea"
          ref={textInputRef}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={onTextKeydown}
          value={message}
          placeholder="placeholder"
        />
      </FloatingLabel>

      <div className="chat-button-bar">
        <Form.Label hidden htmlFor="file-input">
          New Image Upload
        </Form.Label>
        <Form.Control
          id="file-input"
          className="file-input"
          type="file"
          accept="image/*"
          onChange={(ev) => setImage((ev.target as any).files[0])}
          onKeyDown={onTextKeydown}
          ref={imageInputRef}
        />

        <Button
          type="submit"
          variant={sendDisabled ? 'dark' : 'success'}
          disabled={sendDisabled}
        >
          Send
        </Button>
      </div>
    </Form>
  )
}

export default ChatForm
