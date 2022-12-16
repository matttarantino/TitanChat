import { Express, Router } from 'express'
import authRouter from './auth'
import userRouter from './users'
import publicChannelsRouter from './publicChannels'

const routers: Array<{
  route: string
  router: Router
}> = [
  { route: 'users', router: userRouter },
  { route: 'auth', router: authRouter },
  { route: 'channels/public', router: publicChannelsRouter },
  // { route: 'channels/direct', router: directChanellRouter },
]

const configRoutes = (app: Express) => {
  for (const e of routers) app.use(`/api/${e.route}`, e.router)
}

export default configRoutes
