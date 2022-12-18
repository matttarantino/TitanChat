import { io } from 'socket.io-client'

const host =
  process.env.NODE_ENV === 'production'
    ? 'titanschat.herokuapp.com'
    : 'ws://localhost:3001'
const socket = io(host)

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

export const createChannel = (channelData: PublicChannelRegistrationInfo) =>
  socket.emit('createChannel', channelData)

export const newChannelCreated = (
  callback: (args: {}) => void
) => socket.on('channel_created', (args) => callback(args))
