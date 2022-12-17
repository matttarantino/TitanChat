// import React from 'react'
// import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/sideBar.scss'
import Loading from '../../Misc/components/Loading'
// import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
// import * as BsIcons from 'react-icons/bs'
import * as CgIcons from 'react-icons/cg'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { getPublicChannels } from '../../services/privateServices'
import { useStore } from '../../services/appStore'

const SideBar = () => {
  const {
    store: { authInfo },
  } = useStore()
  const [channels, setChannels] = useState<ChannelsResponse>([])
  const [dms, setDms] = useState<ChannelsResponse>([])

  // change initial state of loading to "true" when server is integrated
  const [loadingChannels, setLoadingChannels] = useState(true)
  const [loadingDms, setLoadingDms] = useState(false)

  // change initial state of error to "true" when server is integrated
  const [errorChannels, setErrorChannels] = useState(false)
  const [errorDms, setErrorDms] = useState(false)

  // Modal Stuff for "Add New Channel"
  const [show, setShow] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const handleClose = () => setShow(false)
  const handleOpen = () => setShow(true)

  const addNewChannel = (ev: any) => {
    ev.preventDefault()
    console.log(newChannelName);
    // logic to create new Channel with new channel Name
    handleClose()
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
      async function fetchChannels() {
        getPublicChannels()
          .then(({ data }) => {
            setChannels(data)
          })
          .catch(({ response }) => {
            setErrorChannels(response)
          })
        setLoadingChannels(false)
      }

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

      fetchChannels()
      fetchDms()
    }
  }, [])

  channelList = channels.map((elem) => {
    let path = `/channels/${elem.channelId}`
    let active = location.pathname === path
    return (
      <li className={`list-group-item ${active ? 'active' : ''}`} key={elem.label} >
        <Link
          className={`text-decoration-none ${active ? 'text-white' : ''}`}
          to={`/channels/${elem.channelId}`}
        >
          <AiIcons.AiFillWechat /> {elem.label}
        </Link>
      </li >
    )
  })

  dmsList = DmsSideBarData.map((elem) => {
    return (
      <li className="list-group-item" key={elem.label}>
        <Link className="text-decoration-none" to={`/dms/${elem.channelId}`}>
          {elem.icon} {elem.label}
        </Link>
      </li>
    )
  })

  if (authInfo.authenticated)
    if (loadingChannels || loadingDms) {
      return (
        <nav className="sidebar-container">
          <div className="container"><Loading /></div>
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
          <div className="container">
            Channels
            <ul className="list-group" id="channelSideBar">
              {channelList}
            </ul>
            <br />
            <div className="d-grid">
              <Button
                onClick={handleOpen}
                variant="success"
                type="button"
                id="newChannelButton"
              >
                Add New Channel
              </Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title> Add New Channel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                  <Button type="submit" variant="primary">
                    Add
                  </Button >
                </Modal.Footer >
              </Modal >
            </div >
            <br />
            Direct Messages
            < ul className="list-group" id="dmsSideBar" >
              {dmsList}
            </ul >
            <br />
            <div className="d-grid gap-2">
              <Link
                className="btn btn-outline-dark"
                to="/profile"
              >
                Edit Profile
              </Link>
              <Link className="btn btn-danger" to="/logout">
                Logout
              </Link>
            </div>
          </div >
        </div >
      )
    }
  else return <></>
}

export default SideBar
