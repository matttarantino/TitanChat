import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/sideBar.scss'

import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as BsIcons from 'react-icons/bs'
import * as CgIcons from 'react-icons/cg'
import { useStore } from '../../services/appStore'

const SideBar = () => {
  const {
    store: { authInfo },
  } = useStore()
  const [channels, setChannels] = useState<Array<ChannelsResponse>>([])
  const [dms, setDms] = useState<Array<ChannelsResponse>>([])

  // change initial state of loading to "true" when server is integrated
  const [loadingChannels, setLoadingChannels] = useState(false)
  const [loadingDms, setLoadingDms] = useState(false)

  // change initial state of error to "true" when server is integrated
  const [errorChannels, setErrorChannels] = useState(false)
  const [errorDms, setErrorDms] = useState(false)

  let channelList = null
  let dmsList = null

  const hostIp = null

  const localChannelUrl = 'http://localhost:3001/api/channels'
  const hostChannelUrl = `http://${hostIp}/api/channels`

  const localDmsUrl = 'http://localhost:3001/api/dms'
  const hostDmsUrl = `http://${hostIp}/api/dms`

  const ChannelSideBarData = [
    {
      label: 'General',
      channelId: 'general',
      icon: <AiIcons.AiFillWechat />,
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
    // get channels
    // get dms

    async function fetchChannels() {
      try {
        // const { data } = await axios.get(localChannelUrl)
        // setChannels(data)
        setLoadingChannels(false)
        // setErrorChannels(false)
      } catch (e) {
        console.log('Error: ', e)
        // un-comment these when server starts working
        // setLoadingChannels(false)
        // setErrorChannels(true)
      }
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
  }, [])

  channelList = ChannelSideBarData.map((elem) => {
    return (
      <li className="list-group-item">
        <Link className='text-decoration-none' to={`/channels/${elem.channelId}`} key={elem.label}>
          {elem.icon} {elem.label}
        </Link>
      </li>
    )
  })

  dmsList = DmsSideBarData.map((elem) => {
    return (
      <li className="list-group-item">
        <Link className='text-decoration-none' to={`/dms/${elem.channelId}`} key={elem.label}>
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
              <button className="btn btn-primary" type="button" id="newChannelButton">
                Add new channel
              </button>
            </div>

            <br />

            DMs
            <ul className="list-group" id="dmsSideBar">
              {dmsList}
            </ul>
          </div>
        </nav>
      )
    }
  else return <></>
}

export default SideBar
