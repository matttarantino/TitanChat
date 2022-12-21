import '../styles/landingPage.scss'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="div">
      <div className="text-center mt-5">
        <img
          src={process.env.PUBLIC_URL + '/TitanLogo.png'}
          className=""
          width="200"
          height="200"
          alt="Responsive image"
        ></img>
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
        <Link className="btn btn-primary home-link" to="/login">
          Login
        </Link>
        <br />
        <Link className="btn btn-primary home-link" to="/signup">
          Sign-up
        </Link>
        <br />
      </div>
    </div>
  )
}

export default LandingPage
