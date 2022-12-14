/**
 * @author rgorai
 * @description test multiple values at a time for string validity
 * @param data object of values to test. Usage: { val1, val2, ... }
 * @return throws if string is invalid
 */
export const areValidStrings = (data: { [key: string]: any }) => {
  for (const k in data)
    if (typeof data[k] !== 'string' || data[k].trim().length === 0)
      throw `${k} must be a non-empty string.`
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
      throw `${k} must be a ${ensurePositive ? 'positive ' : ''}number.`
}

/**
 * @author rgorai
 * @description collection of http error info to keep error reporting
 *              in our UI components consistent and less tedious
 * @param keyNumber status code for which you want to access info for
 */
export const httpErrors = {
  400: { status: '400', statusText: 'Bad Input' },
  404: { status: '404', statusText: 'Not Found' },
  500: { status: '500', statusText: 'Internal Server Error' },
}

export const isValidUserName = (username: any) => {
  areValidStrings({ Username: username })

  if (username.length < 4) throw 'Username must be at least 4 characters.'

  if (!/^[a-z0-9]+$/gi.test(username)) throw 'Username must be alphanumeric.'
}

export const isValidPassword = (password: any) => {
  areValidStrings({ Password: password })

  if (password.length < 8) throw 'Password must be at least 8 characters'

  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/-_])[A-Za-z\d@$!%*?&/-_]{8,}$/.test(
      password
    )
  )
    throw 'Password must have at least one capital letter, one number, and one special character.'
}
