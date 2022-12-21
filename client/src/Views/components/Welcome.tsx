import '../styles/landingPage.scss'

const Welcome = () => {
  return (
    <div>
      <h1 className="header">Hello!</h1>
      <p className="paragraph">
        {`Welcome to ${process.env.REACT_APP_NAME}. To start messaging, select a public channel the left like #general or #random. Enter your message in the text box and press send. You can also attach a picture if you like as well. The "Add new channel" button will allow you to make a new channel topic that will be available to anyone to start chatting in. Additionally, you can click on a member in the right sidebar of a channel to start privately messaging with that person. Private messages cannot be seen by others. You visit the "Edit Profile" page to change your username or profile photo. Lastly, click "Logout" to exit ${process.env.REACT_APP_NAME}. Any new messages that you missed will be waiting when you return. Enjoy!`}
      </p>
      <div className="text-center my-5">
        <img
          src={process.env.PUBLIC_URL + '/TitanLogo.png'}
          className=""
          width="150"
          height="150"
          alt="Responsive image"
        ></img>
      </div>
    </div>
  )
}

export default Welcome
