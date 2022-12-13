import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { isValidUser, areValidStrings } from '../utils/errors'
import { authenticateUser } from '../utils/auth'
import { getUsersCollection } from './config/mongoCollections'

const SALT_ROUNDS = 8

export const createUser = async (user: UserRegistrationInfo) => {
  // error check
  try {
    isValidUser(user)
  } catch (err) {
    throw `DB Error: ${String(err)}`
  }

  // check if username exists
  // ** make sure to compare them when lowercase **
  const usersCollection = await getUsersCollection()
  if (await usersCollection.findOne({ username: user.username }))
    throw 'DB Error: Username is taken.'

  // hash password
  user.password = bcrypt.hashSync(user.password, SALT_ROUNDS)

  // add new entry to db
  const retval = await usersCollection.insertOne(user)
  if (!retval.acknowledged)
    throw `DB Error: failed to add user ${String(user)}.`
  return await getUser(String(retval.insertedId))
}

export const getUser = async (userId: string): Promise<UserData | null> => {
  let userIdObj

  // error check
  try {
    areValidStrings({ userId })
    userIdObj = new ObjectId(userId)
  } catch (err) {
    return null
  }

  // find and return entry
  const usersCollection = await getUsersCollection()
  const user = (await usersCollection.findOne({
    _id: userIdObj,
  })) as any
  return user ? { ...user, _id: userId, password: undefined } : null
}

export const getAllUsers = async (): Promise<Array<UserData>> => {
  const usersCollection = await getUsersCollection()
  return (await usersCollection
    .find({})
    .map((e) => ({ ...e, _id: String(e._id) }))
    .toArray()) as any
}

export const validateUser = async (
  loginSpecs: LoginSpecs
): Promise<AuthResponse> => {
  const { username, password } = loginSpecs
  // let { username } = loginSpecs

  // lookup user by username or email
  // ** make sure to compare them when lowercase **
  // username = username.toLowerCase()

  const usersCollection = await getUsersCollection()
  const user = await usersCollection.findOne({ username })

  // check password
  if (!user || !bcrypt.compareSync(password, user.password))
    return authenticateUser(false)

  return authenticateUser(String(user._id), user.username)
}
