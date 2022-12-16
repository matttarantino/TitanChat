import { io } from 'socket.io-client'

const socket = io('ws://localhost:4000')

socket.on('message', ({ messageData }: { messageData: Message }) => {
  console.log(messageData)
})

export const emitMessage = (newMessage: Message) => {
  socket.emit('message', newMessage)
}
