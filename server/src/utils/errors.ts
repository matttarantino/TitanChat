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

export const isValidUser = (user: any) => {
  const { username, password }: UserRegistrationInfo = user

  areValidStrings({ username, password })

  // check if username satifies conditions

  // check if password satifies conditions
}
