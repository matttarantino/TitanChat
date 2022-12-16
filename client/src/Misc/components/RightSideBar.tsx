import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../../services/appStore'
import { getAllUsers } from '../../services/privateServices'
import '../styles/rightSideBar.scss'

const RightSideBar = () => {
  const {
    store: { authInfo },
  } = useStore()
  const [userData, setUserData] = useState<UserListResponse>([])
  const [isPublic, setPublic] = useState(true)
  let usersList = null
  const location = useLocation()
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getAllUsers()
        setPublic(document.location.href.indexOf('channels') != -1)
        setUserData(data)
      } catch (e) {
        console.log(e)
      }
    }
    if (authInfo.authenticated) fetchData()
  }, [authInfo.authenticated, location])

  usersList = userData.map((user) => {
    if (authInfo.authenticated && user.username != authInfo.username)
      return (
        <li className="list-group-item">
          <Link
            className="text-decoration-none"
            to={`/dms/${user.username}`}
            key={user._id}
          >
            {user.username}
          </Link>
        </li>
      )
  })

  if (authInfo.authenticated && isPublic)
    return (
      <nav className="sidebar-container">
        <div className="container">
          Members
          <ul className="list-group">{usersList}</ul>
          <br />
          <div className="d-grid">
            <Link className="btn btn-primary" to="/logout" type="button">
              Logout
            </Link>
          </div>
        </div>
      </nav>
    )
  else return <></>
}
export default RightSideBar
