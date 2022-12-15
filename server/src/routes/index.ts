import { Express, Router } from 'express'
import authRouter from './auth'
import userRouter from './users'
import channelRouter from './channels'

const routers: Array<{
  route: string
  router: Router
}> = [
    { route: 'user', router: userRouter },
    { route: 'auth', router: authRouter },
    { route: 'channels', router: channelRouter }
  ]

const configRoutes = (app: Express) => {
  for (const e of routers) app.use(`/api/${e.route}`, e.router)
}

export default configRoutes
