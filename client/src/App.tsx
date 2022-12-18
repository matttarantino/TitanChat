import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ErrorPage from './Misc/components/ErrorPage'
import { httpErrors } from './utils/errors'
import DmPage from './Views/components/DmPage'
import LandingPage from './Views/components/LandingPage'
import SideBar from './Misc/components/SideBar'
import RightSideBar from './Misc/components/RightSideBar'
import LoginPage from './Views/components/LoginPage'
import SignupPage from './Views/components/SignupPage'
import ProfilePage from './Views/components/ProfilePage'
import Logout from './Misc/components/Logout'
import AuthWrapper from './services/AuthWrapper'
import { useStore } from './services/appStore'
import PublicChannelPage from './Views/components/PublicChannelPage'
import { onMessageReceived } from './services/sockets'

const APP_SPECS: Array<AppSpec> = [
  {
    name: 'Landing Page',
    path: '/',
    element: <LandingPage />,
    ensureAuthenticated: false,
  },
  {
    name: 'Pulic Channels',
    path: '/channels/:channelId',
    element: <PublicChannelPage />,
    ensureAuthenticated: true,
  },
  {
    name: 'Direct Messages',
    path: '/direct/:dmId',
    element: <DmPage />,
    ensureAuthenticated: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    ensureAuthenticated: false,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <SignupPage />,
    ensureAuthenticated: false,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <ProfilePage />,
    ensureAuthenticated: true,
  },
  {
    name: 'Logout',
    path: '/logout',
    element: <Logout />,
    ensureAuthenticated: null,
  },
]

const App = () => {
  const { store, updateStore } = useStore()
  const [sessionMessages, setSessionMessages] = useState<Array<Message>>([])

  // config message listener
  useEffect(() => {
    onMessageReceived(({ messageData }) => {
      console.log('message received', messageData)
      setSessionMessages((prev) => [messageData, ...prev])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    updateStore('sessionMessages', sessionMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionMessages])

  useEffect(() => {
    console.log({ store })
  }, [store])

  return (
    <div className="App">
      <BrowserRouter>
        <SideBar />

        <main>
          <Routes>
            {APP_SPECS.map((e) => {
              const currRoute = (
                <Route path={e.path} element={e.element} key={e.path} />
              )
              return e.ensureAuthenticated === null ? (
                currRoute
              ) : (
                <Route
                  path={e.path}
                  element={
                    <AuthWrapper
                      ensureNotAuthenticated={!e.ensureAuthenticated}
                    >
                      {e.element}
                    </AuthWrapper>
                  }
                  key={e.path}
                />
              )
            })}

            <Route path="*" element={<ErrorPage {...httpErrors[404]} />} />
          </Routes>
        </main>
        <RightSideBar />
      </BrowserRouter>
    </div>
  )
}

export default App
