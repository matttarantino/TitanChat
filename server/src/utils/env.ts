import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve('server', '.env.local') })

export const { JWT_SECRET_STRING, JWT_EXPIRATION, MONGO_URI } = process.env
