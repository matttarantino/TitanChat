import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../../services/appStore'
import { addDirectChannel, getAllUsers } from '../../services/privateServices'
import { refreshUsers, emitRefreshDirectChannels } from '../../services/sockets'
import '../styles/rightSideBar.scss'

const RightSideBar = () => {
  const {
    store: { authInfo },
  } = useStore()
  const [userData, setUserData] = useState<UserListResponse>([])
  const [isPublic, setIsPublic] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getAllUsers()
        setUserData(data)
      } catch (e) {
        console.log(e)
      }
    }

    // set up user refresh listener
    refreshUsers(() => {
      fetchData()
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getAllUsers()
        setIsPublic(pathname.includes('public'))
        setUserData(data)
      } catch (e) {
        console.log(e)
      }
    }
    if (authInfo.authenticated) fetchData()
  }, [authInfo.authenticated, pathname])

  const onUserClick = (toUser: UserListResponse[number]) => {
    if (authInfo.authenticated)
      addDirectChannel({
        userFromId: authInfo.userId,
        userFromName: authInfo.username,
        userFromProfilePhoto: authInfo.userProfilePhoto,
        userToId: toUser._id,
        userToName: toUser.username,
        userToProfilePhoto: toUser.profilePhotoUrl,
      })
        .then(({ data }: { data: DirectChannel }) => {
          console.log('add direct channel data', data)
          emitRefreshDirectChannels(data)
          navigate(`/direct/${data._id}`)
        })
        .catch(({ response }: any) => {
          if (response.status == 409) navigate(`/direct/${response.data}`)
          else console.error('add direct channel error', response)
        })
  }

  if (authInfo.authenticated && isPublic) {
    const usersList = userData
      .filter((e) => e.username !== authInfo.username)
      .map((user) => (
        <li key={user._id}>
          <button
            className="list-group-item text-decoration-none sidebar-link"
            onClick={() => onUserClick(user)}
          >
            <img
              className="channel-icon"
              src={user.profilePhotoUrl ?? process.env.PUBLIC_URL + '/anon.png'}
              alt={user.username}
            />
            <span>{user.username}</span>
          </button>
        </li>
      ))

    return (
      <div className="sidebar-container rightbar-container">
        <div className="container">
          <div className="bar-label">Members</div>
          <ul className="list-group">
            {usersList.length > 0 ? (
              usersList
            ) : (
              <div className="empty-notice">{`You're the only one here!`}</div>
            )}
          </ul>
        </div>
      </div>
    )
  } else return <></>
}
export default RightSideBar
