import '../styles/landingPage.scss'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="form-container landing-container">
      <div className="text-center">
        <img
          src={process.env.PUBLIC_URL + '/TitanLogo.png'}
          width="200"
          height="200"
          alt="Responsive image"
        />
      </div>
      <h1 className="header">{process.env.REACT_APP_NAME}</h1>
      <p className="paragraph">
        {process.env.REACT_APP_NAME} is a website that allows users to
        communicate with each other in real time using text. TitansChat has a
        user-friendly interface that allows users to easily join and participate
        in conversations with other users. TitansChat is open to users from all
        walks of life and is free to use.
      </p>
      <div className="test">
        <Link className="btn btn-outline-primary" to="/signup">
          Sign-up
        </Link>
        <Link className="btn btn-primary" to="/login">
          Login
        </Link>
        <br />
      </div>
    </div>
  )
}

export default LandingPage
