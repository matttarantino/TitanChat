import path from 'path'
import express from 'express'
import cors from 'cors'
import configRoutes from './routes/index'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {})

io.on('connection', (socket) => {
  // emit status update
  console.log('new client connected', socket.id)

  socket.on('join_channel', (username, channel) => {
    console.log(`${username} has joined ${channel}.`)
    socket.join(channel)
    io.sockets.in(channel).emit('joined_channel', { username: username, channel: channel })
  });

  socket.on('message', (username, channel, message) => {
    io.sockets.in(channel).emit('message', { name: username, message: message })
  });

  socket.on('left_channel', (username, channel) => {
    console.log(`${username} has left ${channel}.`)
    socket.leave(channel)
    io.sockets.in(channel).emit('left_channel', { username: username, channel: channel })
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired')
  });



  socket.onAny((event, ...args) => {
    console.log(event, args)
  })
})

httpServer.listen(4000, () => {
  console.log(`Listening on *:${4000}`);
});

const PORT = 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

configRoutes(app)

app.use(express.static(path.resolve('client', 'build')))
app.get('*', (_, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
