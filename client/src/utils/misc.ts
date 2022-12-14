/**
 * @author rgorai
 * @description gets the value located at the location of an
 *              object specified by a hierarchy of keys
 * @param source object to get value from
 * @param keychain array of string representing the hierarchy of keys from
 *                 the source's root to the desired mutation location
 * @returns the value located at the desired location
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
 * @param keychain array of string representing the hierarchy of keys from
 *                 the source's root to the desired mutation location
 * @param value the value to update with
 * @returns a new object with the updated value
 */
export const setObjValueFromKeychain = (
  source: { [_: string | number]: any },
  keychain: string | Array<string>,
  value: any
): any => {
  const key = typeof keychain === 'string' ? keychain : keychain[0]
  return {
    ...source,
    [key]:
      typeof keychain === 'string' || keychain.length === 1
        ? value
        : setObjValueFromKeychain(source[key] ?? {}, keychain.slice(1), value),
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
