import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { isValidUser, areValidStrings } from '../utils/errors'
import { authenticateUser } from '../utils/auth'
import { getUsersCollection } from './config/mongoCollections'

const SALT_ROUNDS = 8

export const createUser = async (
  user: UserRegistrationInfo
): Promise<UserData> => {
  // error check
  try {
    isValidUser(user)
  } catch (err) {
    throw `DB Error: ${String(err)}`
  }

  // check if username exists
  const usernameLower = user.username.toLowerCase()
  const usersCollection = await getUsersCollection()
  if (await usersCollection.findOne({ usernameLower }))
    throw { type: 'exists', message: 'Username is taken.' }

  // hash password
  user.password = bcrypt.hashSync(user.password, SALT_ROUNDS)

  // add new entry to db
  const retval = await usersCollection.insertOne({
    ...user,
    usernameLower,
    directMessages: [],
  })
  if (!retval.acknowledged)
    throw `DB Error: failed to add user ${String(user)}.`
  return (await getUser(String(retval.insertedId))) as UserData
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

export const getAllUsers = async (): Promise<UserListResponse> => {
  const usersCollection = await getUsersCollection()
  return await usersCollection
    .find({})
    .map((e) => ({ _id: String(e._id), username: e.username }))
    .toArray()
}

export const validateUser = async (
  loginSpecs: LoginSpecs
): Promise<AuthResponse> => {
  const { username, password } = loginSpecs

  const usernameLower = username.toLowerCase()
  const usersCollection = await getUsersCollection()
  const user = await usersCollection.findOne({ usernameLower })

  // check password
  if (!user || !bcrypt.compareSync(password, user.password))
    return authenticateUser(false)

  return authenticateUser(String(user._id), user.username)
}
