import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { httpErrors } from './utils/errors'
import { useStore } from './services/appStore'
import ErrorPage from './Misc/components/ErrorPage'
import DirectChannelPage from './Views/components/DirectChannelPage'
import LandingPage from './Views/components/LandingPage'
import SideBar from './Misc/components/SideBar'
import RightSideBar from './Misc/components/RightSideBar'
import LoginPage from './Views/components/LoginPage'
import SignupPage from './Views/components/SignupPage'
import Welcome from './Views/components/Welcome'
import EditProfilePage from './Views/components/EditProfilePage'
import Logout from './Misc/components/Logout'
import AuthWrapper from './services/AuthWrapper'
import PublicChannelPage from './Views/components/PublicChannelPage'
import AllChannelsLoader from './Channels/components/AllChannelsLoader'
import { onMessageReceived, refreshPublicChannels } from './services/sockets'

const APP_SPECS: Array<AppSpec> = [
  {
    name: 'Landing Page',
    path: '/',
    element: <LandingPage />,
    ensureAuthenticated: false,
  },
  {
    name: 'Public Channels',
    path: '/channels/:channelId',
    element: <PublicChannelPage />,
    ensureAuthenticated: true,
  },
  {
    name: 'Direct Messages',
    path: '/direct/:dmId',
    element: <DirectChannelPage />,
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
  const { store, updateStore } = useStore()

  useEffect(() => {
    // set up message listener
    onMessageReceived((messageData) => {
      console.log('message received', messageData)
      updateStore(
        ['sessionChannelInfo', messageData.channelId, 'messages'],
        messageData,
        true
      )
    })

    // set up public channel refresh listener
    refreshPublicChannels((channelInfo) => {
      console.log('channel added', channelInfo)
      updateStore(['sessionChannelInfo', channelInfo._id], {
        name: channelInfo.name,
        messages: [],
      })
    })

    // set up direct channel refresh listener
    // refreshPublicChannels((channelInfo) => {
    //   console.log('channel added', channelInfo)
    //   updateStore(['sessionChannelInfo', channelInfo._id], {
    //     name: channelInfo.name,
    //     messages: [],
    //   })
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log({ store })
  }, [store])

  const getAuthRoute = (spec: AppSpec) => (
    <Route
      path={spec.path}
      element={
        <AuthWrapper ensureNotAuthenticated={!spec.ensureAuthenticated}>
          {spec.element}
        </AuthWrapper>
      }
      key={spec.path}
    />
  )

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

            {APP_SPECS.filter((e) => e.ensureAuthenticated === false).map((e) =>
              getAuthRoute(e)
            )}

            <Route element={<AllChannelsLoader />}>
              {APP_SPECS.filter((e) => e.ensureAuthenticated === true).map(
                (e) => getAuthRoute(e)
              )}
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
