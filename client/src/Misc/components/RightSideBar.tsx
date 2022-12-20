import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../../services/appStore'
import { addDirectChannel, getAllUsers } from '../../services/privateServices'
import { emitRefreshDirectChannels } from '../../services/sockets'
import '../styles/rightSideBar.scss'

const RightSideBar = () => {
  const {
    store: { authInfo },
  } = useStore()
  const [userData, setUserData] = useState<UserListResponse>([])
  const [isPublic, setIsPublic] = useState(true)
  const navigate = useNavigate()
  const { pathname } = useLocation()

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
          console.log('add direct error', response)
          if (response.status == 409) navigate(`/direct/${response.data}`)
          else console.log('add direct channel error', response)
        })
  }

  const usersList = userData.map((user) => {
    if (authInfo.authenticated && user.username != authInfo.username)
      return (
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
      )
  })

  if (authInfo.authenticated && isPublic)
    return (
      <div className="sidebar-container rightbar-container">
        <div className="container">
          <div className="bar-label">Members</div>
          <ul className="list-group">{usersList}</ul>
        </div>
      </div>
    )
  else return <></>
}
export default RightSideBar
