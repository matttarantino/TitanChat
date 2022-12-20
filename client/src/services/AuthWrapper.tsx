import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../services/appStore'
import { authenticateUser, logout } from '../services/authService'

type Props = {
  ensureNotAuthenticated: boolean
}

const AuthWrapper = (props: Props) => {
  const {
    store: { authInfo },
    updateStore,
  } = useStore()
  const { pathname, state } = useLocation()

  // check if user is authenticated
  useEffect(() => {
    authenticateUser((authInfo as any).userId, (authInfo as any).username)
      .then(({ data }) => updateStore('authInfo', data))
      .catch(() => updateStore('authInfo', logout()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return props.ensureNotAuthenticated === authInfo.authenticated ? (
    props.ensureNotAuthenticated ? (
      <Navigate replace to={state?.from ?? `/welcome`} />
    ) : (
      <Navigate replace to="/login" state={{ from: pathname }} />
    )
  ) : (
    <Outlet />
  )
}

export default AuthWrapper
