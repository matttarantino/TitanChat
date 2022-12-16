import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../services/appStore'
import { getAllUsers } from '../../services/privateServices'
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
        const { data } = await getAllUsers()
        setUserData(data)
      } catch (e) {
        console.log(e)
      }
    }
    if (authInfo.authenticated) fetchData()
  }, [authInfo.authenticated])

  usersList = userData.map((user) => {
    if (authInfo.authenticated && user.username != authInfo.username)
      return (
        <div>
          <Link to={`/dms/${user.username}`} key={user._id}>
            {user.username}
          </Link>
        </div>
      )
  })

  if (authInfo.authenticated)
    return (
      <nav className="sidebar-container">
        Right SideBar
        <div id="channelSideBar">{usersList}</div>
        <br />
        <Link to="/logout">Logout</Link>
      </nav>
    )
  else return <></>
}
export default RightSideBar
