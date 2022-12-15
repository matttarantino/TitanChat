import { Collection, Document } from 'mongodb'
import { connectToDb } from './mongoConnection'

const getCollectionFn = (collection: string) => {
  let _col: Collection<Document> | undefined = undefined
  return async () => {
    if (!_col) {
      const db = await connectToDb()
      _col = db.collection(collection)
    }
    return _col as Collection<Document>
  }
}

export const getUsersCollection = getCollectionFn('users')
export const getChannelsCollection = getCollectionFn('channels')