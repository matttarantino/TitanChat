import { Express, Router } from 'express'
import authRouter from './auth'
import userRouter from './users'
import publicChannelscRouter from './publicChannels'
import directChannelsRouter from './directChannels'
import profileRouter from './profile'

const routers: Array<{
  route: string
  router: Router
}> = [
  { route: 'users', router: userRouter },
  { route: 'user/profile', router: profileRouter },
  { route: 'auth', router: authRouter },
  { route: 'channels/public', router: publicChannelscRouter },
  { route: 'channels/direct', router: directChannelsRouter },
]

const configRoutes = (app: Express) => {
  for (const e of routers) app.use(`/api/${e.route}`, e.router)
}

export default configRoutes
