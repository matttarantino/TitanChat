import path from 'path'
import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import configRoutes from './routes/index'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
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

  //   socket.on('left_channel', (username, channel) => {
  //     console.log(`${username} has left ${channel}.`)
  //     socket.leave(channel)
  //     io.sockets
  //       .in(channel)
  //       .emit('left_channel', { username: username, channel: channel })
  //   })

  socket.on('disconnect', () => {
    console.log('Disconnect Fired')
  })

  // socket.onAny((event, ...args) => {
  //   console.log(event, args)
  // })
})

httpServer.listen(4000, () => {
  console.log(`Listening on *:${4000}`)
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

configRoutes(app)

app.use(express.static(path.resolve('client', 'build')))
app.get('*', (_, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
