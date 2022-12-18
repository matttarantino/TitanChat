import path from 'path'
import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import configRoutes from './routes/index'
import { Socket } from 'dgram'
import { createChannel } from './data/publicChannels'

const PORT = (process.env.PORT || 3001)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  socket.on('createChannel', async (channelData: PublicChannelRegistrationInfo) => {
    await createChannel(channelData)
    io.sockets.emit('channel_created', {})
  })

  // emit status update
  console.log('new client connected', socket.id)
  // online/offline indicators

  socket.on('join_channel', (username, channel) => {
    console.log(`${username} has joined ${channel}.`)
    socket.join(channel)
    // io.sockets
    //   .in(channel)
    //   .emit('joined_channel', { username: username, channel: channel })
  })

  socket.on('message', (messageData: Message) => {
    console.log('IN HERE', messageData)
    io.sockets.in(messageData.channelId).emit('message', { messageData })
  })

  socket.on('leave_channel', (username, channel) => {
    console.log(`${username} has left ${channel}.`)
    socket.leave(channel)
    // io.sockets
    //   .in(channel)
    //   .emit('left_channel', { username: username, channel: channel })
  })
  socket.on('channel_added', (channelData: PublicChannelRegistrationInfo) => {
    io.sockets.emit('new_channel_added', { channelData })
  })

  socket.on('disconnect', () => {
    console.log('Disconnect Fired')
  })

  // socket.onAny((event, ...args) => {
  //   console.log(event, args)
  // })
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

configRoutes(app)

app.use(express.static(path.resolve('client', 'build')))
app.get('*', (_, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'))
})

httpServer.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`)
})
