import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import '../styles/sideBar.scss'

import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as BsIcons from 'react-icons/bs'
import * as CgIcons from 'react-icons/cg'

const SideBar = () => {
  const [channels, setChannels] = useState<Array<ChannelsResponse>>([])
  const [dms, setDms] = useState<Array<ChannelsResponse>>([])

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
    console.log('Render')
    // get channels
    // get dms

    async function fetchChannels() {
      const { data } = await axios.get(localChannelUrl)
      setChannels(data)
    }
    fetchChannels()

    async function fetchDms() {
      const { data } = await axios.get(localDmsUrl)
      setDms(data)
    }
    fetchDms()
  }, [])

  channelList = ChannelSideBarData.map((elem) => {
    return (
      <a href={`/channels/${elem.channelId}`}>
        {' '}
        {<AiIcons.AiFillWechat />} {elem.label}
      </a>
    )
  })

  dmsList = DmsSideBarData.map((elem) => {
    return (
      <a href={`/dms/${elem.channelId}`}>
        {' '}
        {<CgIcons.CgProfile />} {elem.label}
      </a>
    )
  })

  return (
    <nav>
      Channel SideBar
      <div id="channelSideBar">{channelList}</div>
      <div id="dmsSideBar">{dmsList}</div>
    </nav>
  )
}

export default SideBar
