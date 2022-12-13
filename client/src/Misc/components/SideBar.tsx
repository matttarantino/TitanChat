import { useEffect, useState } from 'react'
import '../styles/sideBar.scss'

const SideBar = () => {
  const [channels, setChannels] = useState<Array<ChannelsResponse>>([])
  const [dms, setDms] = useState<Array<ChannelsResponse>>([])

  useEffect(() => {
    // get channels
    // get dms
  }, [])

  return <nav>sidebar component</nav>
}

export default SideBar
