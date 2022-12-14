import { Express, Router } from 'express'
import channelRouter from './channels'

const routers: Array<{
  route: string
  router: Router
}> = [
    { route: 'channels', router: channelRouter },
    // { route: 'restaurants', router: restaurantRouter },
    // { route: 'auth', router: authRouter },
  ]

const configRoutes = (app: Express) => {
  for (const e of routers) app.use(`/api/${e.route}`, e.router)
}

export default configRoutes
