import '../styles/landingPage.scss'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return(
  <div>
    <h1>TitansChat</h1>
    <p>TitansChat is a website that allows users to communicate with each other in real time using text. TitansChat has a user-friendly interface that allows users to easily join and participate in conversations with other users. TitansChat is open to users from all walks of life and is free to use.</p>
    <Link to="/login">Login</Link>
    <br />
    <Link to="/signup">Sign-up</Link>
  </div>)
}

export default LandingPage
