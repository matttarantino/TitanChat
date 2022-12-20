import {
  createContext,
  useState,
  PropsWithChildren,
  Context,
  useContext,
} from 'react'
import {
  prependToArrayFromKeychain,
  setObjValueFromKeychain,
} from '../utils/misc'

const DEFAULT_STATE: AppState = {
  authInfo: JSON.parse(localStorage.getItem('authInfo') as string) ?? {
    authenticated: false,
  },
  sessionChannelInfo: {
    public: {},
    direct: {},
  },
}

export const appContext: Context<any> = createContext(DEFAULT_STATE)

type UpdateStore = (
  keychain: keyof AppState | [keyof AppState, ...Array<string>],
  newValue: any,
  prependToArray?: true
) => void

export const StoreProvider = (props: PropsWithChildren) => {
  const [store, setStore] = useState(DEFAULT_STATE)

  const updateStore: UpdateStore = (keychain, newValue, prependToArray) =>
    setStore((prev: AppState) => {
      const newState = prependToArray
        ? prependToArrayFromKeychain(prev, keychain, newValue)
        : setObjValueFromKeychain(prev, keychain, newValue)
      const storeKey = typeof keychain === 'string' ? keychain : keychain[0]
      localStorage.removeItem(storeKey)
      localStorage.setItem(storeKey, JSON.stringify(newState[storeKey]))
      return newState
    })

  return <appContext.Provider value={{ store, updateStore }} {...props} />
}

export const useStore = (): {
  store: AppState
  updateStore: UpdateStore
} => useContext(appContext)
