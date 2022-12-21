import { ReactElement, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/sideBar.scss'
import { FiHash } from 'react-icons/fi'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { addPublicChannel } from '../../services/privateServices'
import { useStore } from '../../services/appStore'
import { emitRefreshPublicChannels } from '../../services/sockets'

const SideBar = () => {
  const {
    store: { authInfo, sessionChannelInfo },
  } = useStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Modal Stuff for "Add New Channel"
  const [show, setShow] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const [newChannelError, setNewChannelError] = useState('')

  const handleClose = () => {
    setNewChannelError('')
    setShow(false)
  }
  const handleOpen = () => setShow(true)

  const addNewChannel = (ev: any) => {
    ev.preventDefault()

    if (authInfo.authenticated)
      addPublicChannel({ name: newChannelName, creatorId: authInfo.userId })
        .then(({ data }: { data: PublicChannel }) => {
          emitRefreshPublicChannels(data)
          handleClose()
          setNewChannelError('')
          navigate(`/public/${data._id}`)
        })
        .catch(({ response }) => {
          setNewChannelError(response.data)
        })
  }

  if (
    authInfo.authenticated &&
    sessionChannelInfo.public &&
    sessionChannelInfo.direct
  ) {
    const getSideBarLink = (
      channelId: string,
      channelType: 'public' | 'direct',
      channelIcon: ReactElement
    ) => {
      const path = `/${channelType}/${channelId}`
      const active = pathname === path
      return (
        <li key={path}>
          <Link
            className={`list-group-item ${active ? 'active' : ''} ${
              active ? 'text-white' : ''
            } sidebar-link`}
            to={path}
          >
            {channelIcon}
            <span>{sessionChannelInfo[channelType]?.[channelId].name}</span>
          </Link>
        </li>
      )
    }

    const channelList = Object.keys(sessionChannelInfo.public).map(
      (channelId) => getSideBarLink(channelId, 'public', <FiHash />)
    )

    const dmsList = Object.keys(sessionChannelInfo.direct).map((channelId) =>
      getSideBarLink(
        channelId,
        'direct',
        <img
          className="channel-icon"
          src={
            sessionChannelInfo.direct?.[channelId].channelIcon ??
            process.env.PUBLIC_URL + '/anon.png'
          }
          alt={sessionChannelInfo.direct?.[channelId].name}
        />
      )
    )

    return (
      <div className="sidebar-container">
        <div className="channels-list">
          <div className="bar-label">Channels</div>

          <ul className="list-group channel-list" id="channelSideBar">
            {channelList.length > 0 ? (
              channelList
            ) : (
              <div className="empty-notice">Create a new channel below!</div>
            )}
          </ul>

          <div className="d-grid">
            <Button
              className="mb-3"
              onClick={handleOpen}
              variant="secondary"
              type="button"
              id="newChannelButton"
            >
              Add new channel
            </Button>

            <Modal show={show} onHide={handleClose} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title> Add New Channel</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {newChannelError && (
                  <Form.Group className="mb-3 form-error">
                    {newChannelError}
                  </Form.Group>
                )}

                <Form onSubmit={addNewChannel}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>New Channel Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Channel Name"
                      autoFocus
                      onChange={(event) => {
                        setNewChannelError('')
                        setNewChannelName(event.target.value)
                      }}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button type="submit" variant="primary" onClick={addNewChannel}>
                  Add
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <br />

          <div className="bar-label">Direct Messages</div>

          <ul className="list-group" id="dmsSideBar">
            {dmsList.length > 0 ? (
              dmsList
            ) : (
              <div className="empty-notice">
                Start a direct message from any channel!
              </div>
            )}
          </ul>
        </div>

        <div className="container d-grid gap-2 pt-3 button-container">
          <Link className="btn btn-outline-dark" to="/profile">
            Edit Profile
          </Link>
          <Link className="btn btn-danger" to="/logout">
            Logout
          </Link>
          <div className="text-center my-3">
            <img
              src={process.env.PUBLIC_URL + '/TitanLogo.png'}
              className=""
              width="50"
              height="50"
              alt="Responsive image"
            ></img>
          </div>
        </div>
      </div>
    )
  } else return <></>
}

export default SideBar
