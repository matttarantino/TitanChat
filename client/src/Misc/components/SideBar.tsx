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
      <Link to={`/channels/${elem.channelId}`} key={elem.label}>
        {elem.icon} {elem.label}
      </Link>
    )
  })

  dmsList = DmsSideBarData.map((elem) => {
    return (
      <Link to={`/dms/${elem.channelId}`} key={elem.label}>
        {elem.icon} {elem.label}
      </Link>
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
          Channel SideBar
          <div id="channelSideBar">{channelList}</div>
          <div id="dmsSideBar">{dmsList}</div>
          <br />
          <Link to="/logout">Logout</Link>
        </nav>
      )
    }
  else return <></>
}

export default SideBar
