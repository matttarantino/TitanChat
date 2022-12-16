import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../services/appStore'
import { GetAllUsers } from '../../services/protectedService'
import '../styles/rightSideBar.scss'

const RightSideBar = () => {
  const {
    store: { authInfo },
  } = useStore()
  const [userData, setUserData] = useState<UserListResponse>([])
  let usersList = null

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await GetAllUsers()
        setUserData(data)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [])

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

  if (authInfo.authenticated)
    return (
      <nav className="sidebar-container">
        <div className="container">
          Members
          <ul className="list-group" id="channelSideBar">
            {usersList}
          </ul>
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
