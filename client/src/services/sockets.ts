import { io } from 'socket.io-client'

const host = process.env.NODE_ENV === 'production' ? 'titanschat.herokuapp.com' : 'localhost:3001'
const socket = io(host)

socket.on('message', ({ messageData }: { messageData: Message }) => {
  console.log(messageData)
})

export const emitMessage = (newMessage: Message) => {
  socket.emit('message', newMessage)
}
