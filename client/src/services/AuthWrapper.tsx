import { PropsWithChildren, ReactElement, useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../services/appStore'
import { authenticateUser, logout } from '../services/authService'

type Props = {
  ensureNotAuthenticated: boolean | null
}

const AuthWrapper = (props: Props & PropsWithChildren) => {
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
  }, [])

  return props.ensureNotAuthenticated === authInfo.authenticated ? (
    props.ensureNotAuthenticated ? (
      <Navigate replace to={state?.from ?? '/channels/general'} />
    ) : (
      <Navigate replace to="/login" state={{ from: pathname }} />
    )
  ) : (
    (props.children as ReactElement)
  )
}

export default AuthWrapper
