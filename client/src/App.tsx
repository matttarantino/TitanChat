import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { httpErrors } from './utils/errors'
import { useStore } from './services/appStore'
import ErrorPage from './Misc/components/ErrorPage'
import LandingPage from './Views/components/LandingPage'
import SideBar from './Misc/components/SideBar'
import RightSideBar from './Misc/components/RightSideBar'
import LoginPage from './Views/components/LoginPage'
import SignupPage from './Views/components/SignupPage'
import Welcome from './Views/components/Welcome'
import EditProfilePage from './Views/components/EditProfilePage'
import Logout from './Misc/components/Logout'
import AuthWrapper from './services/AuthWrapper'
import AllChannelsLoader from './Channels/components/AllChannelsLoader'
import {
  onMessageReceived,
  refreshDirectChannels,
  refreshPublicChannels,
} from './services/sockets'
import ChannelPage from './Views/components/ChannelPage'

const APP_SPECS: Array<AppSpec> = [
  {
    name: 'Landing Page',
    path: '/',
    element: <LandingPage />,
    ensureAuthenticated: false,
  },
  {
    name: 'Public Channels',
    path: '/public/:publicChannelId',
    element: <ChannelPage channelType="public" paramName="publicChannelId" />,
    ensureAuthenticated: true,
  },
  {
    name: 'Direct Messages',
    path: '/direct/:directChannelId',
    element: <ChannelPage channelType="direct" paramName="directChannelId" />,
    ensureAuthenticated: true,
  },
  {
    name: 'Welcome',
    path: '/welcome',
    element: <Welcome />,
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
    element: <EditProfilePage />,
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
  const {
    store: { authInfo },
    updateStore,
  } = useStore()
  const { store } = useStore()

  useEffect(() => {
    if (authInfo.authenticated) {
      // set up message listener
      onMessageReceived((messageData) => {
        console.log('message received', messageData)
        updateStore(
          [
            'sessionChannelInfo',
            messageData.channelType,
            messageData.channelId,
            'messages',
          ],
          messageData,
          true
        )
      })

      // set up public channel refresh listener
      refreshPublicChannels((channelInfo) => {
        console.log('channel added', channelInfo)
        updateStore(['sessionChannelInfo', 'public', channelInfo._id], {
          name: channelInfo.name,
          messages: [],
        })
      })

      // set up direct channel refresh listener
      refreshDirectChannels((channelInfo) => {
        console.log('direct channel added', channelInfo)
        if (
          authInfo.username === channelInfo.userFromName ||
          authInfo.username === channelInfo.userToName
        )
          updateStore(['sessionChannelInfo', 'direct', channelInfo._id], {
            name: channelInfo.userToName,
            messages: [],
          })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log({ store })
  }, [store])

  return (
    <div className="App">
      <BrowserRouter>
        <SideBar />

        <main>
          <Routes>
            {APP_SPECS.filter((e) => e.ensureAuthenticated === null).map(
              (e) => (
                <Route path={e.path} element={e.element} key={e.path} />
              )
            )}

            <Route element={<AuthWrapper ensureNotAuthenticated={true} />}>
              {APP_SPECS.filter((e) => e.ensureAuthenticated === false).map(
                (e) => (
                  <Route path={e.path} element={e.element} key={e.path} />
                )
              )}
            </Route>

            <Route element={<AuthWrapper ensureNotAuthenticated={false} />}>
              <Route element={<AllChannelsLoader />}>
                {APP_SPECS.filter((e) => e.ensureAuthenticated === true).map(
                  (e) => (
                    <Route path={e.path} element={e.element} key={e.path} />
                  )
                )}
              </Route>
            </Route>

            <Route path="*" element={<ErrorPage {...httpErrors[404]} />} />
          </Routes>
        </main>
        <RightSideBar />
      </BrowserRouter>
    </div>
  )
}

export default App
