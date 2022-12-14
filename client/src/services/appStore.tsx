import {
  createContext,
  useState,
  PropsWithChildren,
  Context,
  useContext,
} from 'react'
import { setObjValueFromKeychain } from '../utils/misc'

const DEFAULT_STATE = {
  authInfo: JSON.parse(localStorage.getItem('authInfo') as string) ?? {
    authenticated: false,
  },
}

export const appContext: Context<any> = createContext(DEFAULT_STATE)

type UpdateStore = (
  keychain: keyof AppState | [keyof AppState, ...Array<string>],
  newValue: any
) => void

export const StoreProvider = (props: PropsWithChildren) => {
  const [store, setStore] = useState(DEFAULT_STATE)

  const updateStore: UpdateStore = (keychain, newValue) => {
    setStore((prev: AppState) => {
      const newState = setObjValueFromKeychain(prev, keychain, newValue)
      const storeKey = typeof keychain === 'string' ? keychain : keychain[0]
      localStorage.removeItem(storeKey)
      localStorage.setItem(storeKey, JSON.stringify(newState[storeKey]))
      return newState
    })
  }

  return <appContext.Provider value={{ store, updateStore }} {...props} />
}

export const useStore = (): {
  store: AppState
  updateStore: UpdateStore
} => useContext(appContext)
