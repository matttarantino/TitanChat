// import React from 'react'
// import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/sideBar.scss'
import * as CgIcons from 'react-icons/cg'
import { FiHash } from 'react-icons/fi'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Loading from '../../Misc/components/Loading'
import { addPublicChannel } from '../../services/privateServices'
import { useStore } from '../../services/appStore'
import { emitRefreshPubliChannels } from '../../services/sockets'

const SideBar = () => {
  const {
    store: { authInfo, sessionChannelInfo },
  } = useStore()
  const navigate = useNavigate()
  const [dms, setDms] = useState<ChannelsResponse>([])

  // change initial state of loading to "true" when server is integrated
  // const [loadingChannels, setLoadingChannels] = useState(true)
  const [loadingDms, setLoadingDms] = useState(false)

  // change initial state of error to "true" when server is integrated
  const [errorChannels, setErrorChannels] = useState(false)
  const [errorDms, setErrorDms] = useState(false)

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
          emitRefreshPubliChannels(data)
          handleClose()
          setNewChannelError('')
          navigate(`/channels/${data._id}`)
        })
        .catch(({ response }) => {
          setNewChannelError(response.data)
        })
  }

  const location = useLocation()

  let channelList = null
  let dmsList = null

  const DmsSideBarData = [
    {
      label: 'Random 1',
      channelId: 'random1',
      icon: <CgIcons.CgProfile />,
    },
  ]

  useEffect(() => {
    if (authInfo.authenticated) {
      async function fetchDms() {
        try {
          // const { data } = await axios.get(localDmsUrl)
          // setDms(data)
          setLoadingDms(false)
          // setErrorDms(false)
        } catch (e) {
          console.log('Error: ', e)
          // un-comment these when server starts working
          // setLoadingDms(false)
          // setErrorChannels(true)
        }
      }

      fetchDms()
    }
  }, [authInfo.authenticated])

  channelList = Object.keys(sessionChannelInfo).map((channelId) => {
    const path = `/channels/${channelId}`
    const active = location.pathname === path
    return (
      <li key={channelId}>
        <Link
          className={`list-group-item ${active ? 'active' : ''} ${
            active ? 'text-white' : ''
          }`}
          to={path}
        >
          <FiHash /> <span>{sessionChannelInfo[channelId].name}</span>
        </Link>
      </li>
    )
  })

  dmsList = DmsSideBarData.map((elem) => {
    return (
      <li key={elem.label}>
        <Link
          className="list-group-item text-decoration-none"
          to={`/dms/${elem.channelId}`}
        >
          {elem.icon} {elem.label}
        </Link>
      </li>
    )
  })

  if (authInfo.authenticated && Object.keys(sessionChannelInfo).length > 0)
    if (loadingDms) {
      return (
        <nav className="sidebar-container">
          <div className="container">
            <Loading />
          </div>
        </nav>
      )
    } else if (errorChannels || errorDms) {
      return (
        <nav className="sidebar-container">
          <div className="container">Error Loading Data ...</div>
        </nav>
      )
    } else {
      return (
        <div className="sidebar-container">
          <div className="channels-list">
            <div className="bar-label">Channels</div>

            <ul className="list-group channel-list" id="channelSideBar">
              {channelList}
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
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={addNewChannel}
                  >
                    Add
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <br />

            <div className="bar-label">Direct Messages</div>

            <ul className="list-group" id="dmsSideBar">
              {dmsList}
            </ul>
          </div>

          <div className="container d-grid gap-2 pt-3 button-container">
            <Link className="btn btn-outline-dark" to="/profile">
              Edit Profile
            </Link>
            <Link className="btn btn-danger" to="/logout">
              Logout
            </Link>
          </div>
        </div>
      )
    }
  else return <></>
}

export default SideBar
