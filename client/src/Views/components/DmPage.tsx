import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorPage from '../../Misc/components/ErrorPage'
import Loading from '../../Misc/components/Loading'
import { areValidStrings, httpErrors } from '../../utils/errors'
import '../styles/dmPage.scss'

const DmPage = () => {
  const [pageData, setPageData] = useState<DmChannel | null>(null)
  const [pageError, setPageError] = useState<RouteError | null>(null)
  const { dmId } = useParams()

  useEffect(() => {
    // error check
    try {
      areValidStrings({ dmId })
    } catch (err) {
      return setPageError(httpErrors[400])
    }

    // request data from server

    // cleanup
  }, [dmId])

  return pageError ? (
    <ErrorPage {...pageError} />
  ) : pageData ? (
    <div>dm page component</div>
  ) : (
    <Loading />
  )
}

export default DmPage
