import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorPage from '../../Misc/components/ErrorPage'
import Loading from '../../Misc/components/Loading'
import { areValidStrings, httpErrors } from '../../utils/errors'
import '../styles/channelPage.scss'

const ChannelPage = () => {
  const [pageData, setPageData] = useState<PublicChannel | null>(null)
  const [pageError, setPageError] = useState<RouteError | null>(null)
  const { channelId } = useParams()

  useEffect(() => {
    // error check
    try {
      areValidStrings({ channelId })
    } catch (err) {
      setPageError(httpErrors[400])
    }

    // request data from server

    // cleanup
  }, [channelId])

  return pageError ? (
    <ErrorPage {...pageError} />
  ) : pageData ? (
    <div>channel page component</div>
  ) : (
    <Loading />
  )
}

export default ChannelPage
