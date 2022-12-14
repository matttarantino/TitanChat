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
      username: string
      access_token: string
    }
