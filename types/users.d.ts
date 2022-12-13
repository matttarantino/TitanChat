/**
 * @author rgorai
 * @description all of the data tied to a user. This probably won't ever
 *              be used directly but rather variations of it (below)
 * @param firstName user's first name
 * @param lastName user's last name
 * @param username user's unique username
 * @param password user's password
 * @param directMessages array of {@link DmChannel} ids that
 *                       the user is a part of
 */
type User = {
  _id: string
  username: string
  password: string
  directMessages: Array<string>
}

/**
 * @author rgorai
 * @description the user data that will be sent to the client.
 *              See {@link User} for param descriptions.
 */
type UserData = Omit<User, 'password'>

/**
 * @author rgorai
 * @description the data that the user will use to sign up. See
 *              {@link User} for param descriptions.
 */
type UserRegistrationInfo = Omit<User, '_id' | 'directMessages'>

/**
 * @author rgorai
 * @description the data that will be used to log a user in
 */
type LoginSpecs = {
  username: string
  password: string
}
