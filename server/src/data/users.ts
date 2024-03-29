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
  return (await getUserById(String(retval.insertedId))) as UserData
}

export const getUserById = async (userId: string): Promise<UserData | null> => {
  let userIdObj

  // error check
  try {
    areValidStrings({ userId })
    userIdObj = new ObjectId(userId)
  } catch (err) {
    throw `DB Error: ${String(err)}`
  }

  // find and return entry
  const usersCollection = await getUsersCollection()
  const user = (await usersCollection.findOne({
    _id: userIdObj,
  })) as any
  return user ? { ...user, _id: userId, password: undefined } : null
}

export const getUserByUsername = async (
  username: string
): Promise<UserData | null> => {
  // error check
  try {
    areValidStrings({ username })
  } catch (err) {
    return null
  }

  // find and return entry
  const usersCollection = await getUsersCollection()
  const user = (await usersCollection.findOne({
    username,
  })) as any
  return user ? { ...user, _id: String(user._id), password: undefined } : null
}

export const updateUser = async (
  userData: UserUpdateInfo
): Promise<UserData | null> => {
  let userIdObj

  // error check
  try {
    const { profilePhotoUrl: _, ...requiredInfo } = userData
    areValidStrings(requiredInfo)
    userIdObj = new ObjectId(userData._id)
  } catch (err) {
    throw `DB Error: ${String(err)}`
  }

  const usersCollection = await getUsersCollection()
  const user = (await usersCollection.findOne({
    _id: userIdObj,
  })) as any

  if (!user) {
    throw 'No user exists with that ID'
  }

  const { _id: _, ...updateData } = userData

  if (
    userData.usernameLower != user.usernameLower &&
    (await usersCollection.findOne({ usernameLower: userData.usernameLower }))
  )
    throw { type: 'exists', message: 'Username is taken.' }

  const retval = await usersCollection.updateOne(
    { _id: userIdObj },
    {
      $set: updateData,
    }
  )

  if (!retval.acknowledged)
    throw `DB Error: failed to add user ${String(user)}.`

  return (await getUserById(String(userData._id))) as UserData
}

export const getAllUsers = async (): Promise<UserListResponse> => {
  const usersCollection = await getUsersCollection()
  return await usersCollection
    .find({})
    .map((e) => ({
      _id: String(e._id),
      username: e.username,
      profilePhotoUrl: e.profilePhotoUrl,
    }))
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

  return authenticateUser(String(user._id), user.username, user.profilePhotoUrl)
}
