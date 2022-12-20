import { PropsWithChildren, ReactElement, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../services/appStore'
import { authenticateUser, logout } from '../services/authService'

type Props = {
  ensureNotAuthenticated: boolean
}

const AuthWrapper = (props: Props & PropsWithChildren) => {
  const {
    store: { authInfo },
    updateStore,
  } = useStore()
  const { pathname, state } = useLocation()

  // check if user is authenticated
  useEffect(() => {
    if (authInfo.authenticated) {
      authenticateUser(authInfo.userId, authInfo.username)
        .then(({ data }) => updateStore('authInfo', data))
        .catch(() => updateStore('authInfo', logout()))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authInfo.authenticated])

  return props.ensureNotAuthenticated === authInfo.authenticated ? (
    props.ensureNotAuthenticated ? (
      <Navigate replace to={state?.from ?? `/welcome`} />
    ) : (
      <Navigate replace to="/login" state={{ from: pathname }} />
    )
  ) : (
    (props.children as ReactElement)
  )
}

export default AuthWrapper
