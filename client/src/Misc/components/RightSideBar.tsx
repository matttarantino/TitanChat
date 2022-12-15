import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/rightSideBar.scss'

import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as BsIcons from 'react-icons/bs'
import * as CgIcons from 'react-icons/cg'
import { useStore } from '../../services/appStore'

const RightSideBar = () => {
  const {
    store: { authInfo },
  } = useStore()
  const [userData, setUserData] = useState(undefined)

  const usersUrl = 'http:/localhost:3001/api/users'

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(usersUrl)
        console.log(data)
        console.log(data)
        setUserData(data)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  })

  const makeUser = (user) => {
    return <div>{user.name}</div>
  }

  const usersList =
    userData &&
    userData.map((user) => {
      return makeUser(user)
    })

  if (authInfo.authenticated)
    return (
      <nav className="sidebar-container">
        Right SideBar
        <div id="channelSideBar">{usersList}</div>
      </nav>
    )
  else return <></>
}
export default RightSideBar
