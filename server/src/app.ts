import path from 'path'
import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import configRoutes from './routes/index'

const PORT = process.env.PORT || 3001

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://titanschat.herokuapp.com'
        : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('new client connected', socket.id)

  socket.on('join_channel', (username, channel) => {
    console.log(`${username} has joined ${channel}.`)
    socket.join(channel)
  })

  socket.on('message', (messageData: Message) => {
    io.sockets.in(messageData.channelId).emit('message', messageData)
  })

  socket.on('leave_channel', (username, channel) => {
    console.log(`${username} has left ${channel}.`)
    socket.leave(channel)
  })

  socket.on('public_channel_added', (channelInfo) => {
    io.sockets.emit('public_channel_added', channelInfo)
  })

  socket.on('disconnect', () => {
    console.log('Disconnect Fired')
  })
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
