/**
 * @author rgorai
 * @description gets the value located at the location of an
 *              object specified by a hierarchy of keys
 * @param source object to get value from
 * @param keychain array of string representing the hierarchy of keys from
 *                 the source's root to the desired mutation location
 * @returns the value located at the desired location, or undefined
 *          if the value doesn't exists / an invlaid keychain is supplied
 */
export const getObjValueFromKeychain = (
  source: any,
  keychain: Array<string>
): any =>
  !source
    ? undefined
    : keychain.length === 0
    ? source
    : getObjValueFromKeychain(source[keychain[0]], keychain.slice(1))

/**
 * @author rgorai
 * @description returns a deep copy of an object with an updated value
 *              at the location specified by the supplised keychain
 * @param source object to set value in
 * @param keychain array of strings representing the hierarchy of keys from
 *                 the source's root to the desired mutation location
 * @param value the value to update with
 * @returns a new object with the updated value
 */
export const setObjValueFromKeychain = (
  source: { [_: string]: any },
  keychain: string | Array<string>,
  value: any
): any => {
  const key = typeof keychain === 'string' ? keychain : keychain[0]
  return {
    ...source,
    [key]:
      typeof keychain === 'string' || keychain.length === 1
        ? value
        : setObjValueFromKeychain(source[key], keychain.slice(1), value),
  }
}

/**
 * @author rgorai
 * @description prepends a value to an array that is nested in an object.
 *              See {@link setObjValueFromKeychain} for param definitions.
 */
export const prependToArrayFromKeychain = (
  source: any,
  keychain: string | Array<string>,
  value: any
): any => {
  try {
    return typeof keychain === 'string'
      ? { ...source, [keychain]: [value, ...source[keychain]] }
      : keychain.length === 1
      ? { ...source, [keychain[0]]: [value, ...source[keychain[0]]] }
      : {
          ...source,
          [keychain[0]]: prependToArrayFromKeychain(
            source[keychain[0]],
            keychain.slice(1),
            value
          ),
        }
  } catch (err) {
    return 'Prepend Error: Invalid keychain.'
  }
}

/**
 * @author rgorai
 * @description generates a document title based on the app's name
 * @param args list of titles to add to document title
 * @returns title string with each title separated by a '|',
 *          and ending with the app name
 */
export const setDocumentTitle = (...args: Array<string>) => {
  document.title = `${args.reduce(
    (p, c) => `${p} ${p !== '' ? '|' : ''} ${c}`,
    ''
  )} | ${process.env.REACT_APP_NAME}`
}
