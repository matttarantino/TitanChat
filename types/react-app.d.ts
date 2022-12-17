/**
 * @author rgorai
 * @description schema for our app's features
 * @param name name of the feature
 * @param path path to the feature
 * @param element React element to be rendered
 * @param ensureAuthenticated true if user needs to be authenticated
 *    to view this feature, false if the user needs to be unauthenticated,
 *    and null if it does not matter
 */
type AppSpec = {
  name: string
  path: string
  element: JSX.Element
  ensureAuthenticated: boolean | null
}

/**
 * @author rgorai
 * @description info for rendering an error UI component; can be
 *              spread from an axios error response
 * @param status error status code
 * @param statusText corresponding error status text
 * @param data optional associated error data to view in console
 */
type RouteError = {
  status: string
  statusText: string
  data?: string
}

/**
 * @author rgorai
 * @description defines the app's Context type
 * @param authInfo stores the user's authentication info as {@link AuthResponse}
 */
type AppState = {
  authInfo: AuthResponse
}
