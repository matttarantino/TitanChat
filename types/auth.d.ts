/**
 * @author rgorai
 * @description defines the schema for the authentication
 *              information betweeen server and client
 */
type AuthResponse =
  | {
      authenticated: false
    }
  | {
      authenticated: true
      userId: string
      userProfilePhoto: string | null | undefined
      username: string
      access_token: string
    }
