import { io } from 'socket.io-client'

const socket = io(`${process.env.HOST}`)

socket.on('message', ({ messageData }: { messageData: Message }) => {
  console.log(messageData)
})

export const emitMessage = (newMessage: Message) => {
  socket.emit('message', newMessage)
}
