import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../../services/appStore'
import { logout } from '../../services/authService'

const Logout = () => {
  const { updateStore } = useStore()

  useEffect(() => {
    updateStore('authInfo', logout())
  }, [updateStore])

  return <Navigate replace to="/" />
}

export default Logout
