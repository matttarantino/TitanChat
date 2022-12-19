/**
 * @author rgorai
 * @description all of the data tied to a user. This probably won't ever
 *              be used directly but rather variations of it (below)
 * @param username user's case-preserved unique username
 * @param usernameLower lowercase version of user's username to check for
 *                      case insensitive duplicates
 * @param password user's password
 * @param directMessages array of {@link DmChannel} ids that
 *                       the user is a part of
 */
type User = {
  _id: string
  username: string
  usernameLower: string
  password: string
  profilePhotoUrl: string
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
 * @description the list of user data returned by the all user's list
 *              endpoint. See {@link User} for param descriptions.
 */
type UserListResponse = Array<
  Omit<UserData, 'directMessages' | 'usernameLower'>
>

/**
 * @author rgorai
 * @description the data that the user will use to sign up. See
 *              {@link User} for param descriptions.
 */
type UserRegistrationInfo = Omit<
  User,
  '_id' | 'usernameLower' | 'directMessages'
>

/**
 * @author rgorai
 * @description the data that will be used to log a user in
 */
type LoginSpecs = {
  username: string
  password: string
}

/**
 * @author matttarantino
 * @description the data to update a user from the profile page. See
 *              {@link User} for param descriptions.
 */
type UserUpdateInfo = Omit<
  User,
  'password' | 'directMessages'
>
