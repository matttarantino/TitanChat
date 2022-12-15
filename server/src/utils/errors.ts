/**
 * @author rgorai
 * @description test multiple values at a time for string validity
 * @param data object of values to test. Usage: { val1, val2, ... }
 * @return throws if string is invalid
 */
export const areValidStrings = (data: { [key: string]: any }) => {
  for (const k in data)
    if (typeof data[k] !== 'string' || data[k].trim().length === 0)
      throw `${k} must be a non-empty string. Received: ${data[k]}`
}

/**
 * @author rgorai
 * @description test multiple values at a time for number validity
 * @param data object of values to test. Usage: { val1, val2, ... }
 * @param ensurePositive optional parameter to ensure that all
 *                       numbers should be positive
 * @return throws if number is invalid
 */
export const areValidNumbers = (
  data: { [key: string]: any },
  ensurePositive?: boolean
) => {
  for (const k in data)
    if (isNaN(Number(data[k])) || (ensurePositive && Number(data[k]) <= 0))
      throw `${k} must be a ${
        ensurePositive ? 'positive ' : ''
      }number. Received: ${data[k]}`
}

export const isValidChannelName = (channelName: any) => {
  areValidStrings({ channelName })

  if (channelName.length < 4)
    throw 'Channel name must be at least 6 characters.'
}

export const isValidUserName = (username: any) => {
  areValidStrings({ username })

  if (username.length < 4) throw 'Username must be at least 4 characters.'

  if (!/^[a-z0-9]+$/gi.test(username)) throw 'Username must be alphanumeric.'
}

export const isValidPassword = (password: any) => {
  areValidStrings({ password })

  if (password.length < 8) throw 'Password must be at least 8 characters'

  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/-_])[A-Za-z\d@$!%*?&/-_]{8,}$/.test(
      password
    )
  )
    throw 'Password must have at least one capital letter, one number, and one special character.'
}

export const isValidUser = (user: any) => {
  const { username, password }: UserRegistrationInfo = user
  isValidUserName(username)
  isValidPassword(password)
}
