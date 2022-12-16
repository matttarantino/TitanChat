import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/sideBar.scss'

import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as BsIcons from 'react-icons/bs'
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
  const [loadingChannels, setLoadingChannels] = useState(false)
  const [loadingDms, setLoadingDms] = useState(false)

  // change initial state of error to "true" when server is integrated
  const [errorChannels, setErrorChannels] = useState(false)
  const [errorDms, setErrorDms] = useState(false)

  // Modal Stuff for "Add New Channel"
  const [show, setShow] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const handleClose = () => setShow(false)
  const handleOpen = () => setShow(true)
  const addNewChannel = () => {
    handleClose()
  }

  let channelList = null
  let dmsList = null

  const ChannelSideBarData = [
    {
      label: 'General',
      channelId: 'general',
      // icon: <AiIcons.AiFillWechat />,
    },
    {
      label: 'CS-554',
      channelId: 'cs554',
      icon: <AiIcons.AiFillWechat />,
    },
    {
      label: 'Random',
      channelId: 'random',
      icon: <AiIcons.AiFillWechat />,
    },
  ]

  const DmsSideBarData = [
    {
      label: 'Random 1',
      channelId: 'random1',
      icon: <CgIcons.CgProfile />,
    },
  ]

  useEffect(() => {
    if (authInfo.authenticated) {
      getPublicChannels()
        .then(({ data }) => {
          console.log('public channel data', data)
          setChannels([...ChannelSideBarData, ...data])
        })
        .catch(({ response }) => {
          console.error('public channel error', response)
          setErrorChannels(response)
        })

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  channelList = channels.map((elem) => {
    return (
      <li className="list-group-item" key={elem.label}>
        <Link
          className="text-decoration-none"
          to={`/channels/${elem.channelId}`}
        >
          <AiIcons.AiFillWechat /> {elem.label}
        </Link>
      </li>
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
      return <nav>Loading...</nav>
    } else if (errorChannels || errorDms) {
      return <nav>Error Loading Data ...</nav>
    } else {
      return (
        <nav className="sidebar-container">
          <div className="container">
            Channels
            <ul className="list-group" id="channelSideBar">
              {channelList}
            </ul>
            <br />
            <div className="d-grid">
              <Button
                variant="primary"
                onClick={handleOpen}
                className="btn btn-success"
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
                  <Form>
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
                  <Button variant="primary" onClick={addNewChannel}>
                    Add
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <br />
            DMs
            <ul className="list-group" id="dmsSideBar">
              {dmsList}
            </ul>
            <br />
            <div className="d-grid gap-2">
              <Link
                className="btn btn-outline-secondary"
                to="/profile"
                type="button"
              >
                Edit Profile
              </Link>
              <Link
                className="btn btn-outline-danger"
                to="/logout"
                type="button"
              >
                Logout
              </Link>
            </div>
          </div>
        </nav>
      )
    }
  else return <></>
}

export default SideBar
