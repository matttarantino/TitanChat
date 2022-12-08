import { Express, Router } from 'express'

const routers: Array<{
  route: string
  router: Router
}> = [
  // { route: 'user', router: userRouter },
  // { route: 'restaurants', router: restaurantRouter },
  // { route: 'auth', router: authRouter },
]

const configRoutes = (app: Express) => {
  for (const e of routers) app.use(`/api/${e.route}`, e.router)
}

export default configRoutes
