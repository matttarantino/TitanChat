import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/errorPage.scss'

const ErrorPage = (props: RouteError) => {
  const navigate = useNavigate()

  useEffect(() => {
    console.error(props.data)
  }, [props.data])

  return (
    <div className="page-container">
      <div className="go-back" onClick={() => navigate(-1)}>
        Go back
      </div>
      <div className="error-container">{`Error: ${props.status} (${props.statusText})`}</div>
    </div>
  )
}

export default ErrorPage
