import { io } from 'socket.io-client'

const host =
  process.env.NODE_ENV === 'production'
    ? 'https://titanschat.herokuapp.com/'
    : 'ws://localhost:3001'
const socket = io(host)

export const joinChannel = (username: string, channelId: string) =>
  socket.emit('join_channel', username, channelId)

export const leaveChannel = (username: string, channelId: string) =>
  socket.emit('leave_channel', username, channelId)

export const onMessageReceived = (callback: (messageData: Message) => void) =>
  socket.on('message', (args) => callback(args))

export const emitMessage = (newMessage: Message) =>
  socket.emit('message', newMessage)

export const disconnectSocket = () => socket.disconnect()

export const emitRefreshPublicChannels = (channelInfo: PublicChannel) =>
  socket.emit('public_channel_added', channelInfo)

export const refreshPublicChannels = (
  callback: (channelInfo: PublicChannel) => void
) => socket.on('public_channel_added', (channelInfo) => callback(channelInfo))

export const emitRefreshDirectChannels = (channelInfo: DirectChannel) =>
  socket.emit('direct_channel_added', channelInfo)

export const refreshDirectChannels = (
  callback: (channelInfo: DirectChannel) => void
) => socket.on('direct_channel_added', (channelInfo) => callback(channelInfo))

export const emitRefreshUsers = () => socket.emit('refresh_users')

export const refreshUsers = (callback: () => void) =>
  socket.on('refresh_users', () => callback())
