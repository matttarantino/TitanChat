import { io } from 'socket.io-client'

const host = process.env.NODE_ENV === 'production' ? 'titanschat.herokuapp.com' : 'localhost:3001'
const socket = io(host)

// socket.on('message', ({ messageData }: { messageData: Message }) => {
//   console.log('on message listener', messageData)
// })

// socket.on('message', ({ messageData }: { messageData: Message }) => {
//   console.log('on message listener over here', messageData)
// })

export const joinChannel = (username: string, channelId: string) =>
  socket.emit('join_channel', username, channelId)

export const leaveChannel = (username: string, channelId: string) => {
  console.log('CHANNEL LEFT')
  socket.emit('leave_channel', username, channelId)
}

export const onMessageReceived = (
  callback: (args: { messageData: Message }) => void
) => socket.on('message', (args) => callback(args))

export const emitMessage = (newMessage: Message) =>
  socket.emit('message', newMessage)

export const disconnectSocket = () => socket.disconnect()
