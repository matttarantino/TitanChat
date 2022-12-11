import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const mongoConfig = {
  serverUrl: (process.env.MONGO_URI as string) || 'mongodb://localhost:27017/',
  database: 'cs554-project-titan-db',
}

let _connection: MongoClient | undefined = undefined
let _db: Db | undefined = undefined

export const connectToDb = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl)
    _db = _connection.db(mongoConfig.database)
  }
  return _db as Db
}

export const closeConnection = () => {
  ;(_connection as MongoClient).close()
}
