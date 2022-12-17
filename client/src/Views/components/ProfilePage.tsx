import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useStore } from '../../services/appStore'
import '../styles/profilePage.scss'

const ProfilePage = () => {
  const {
    store: { authInfo },
  } = useStore()

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()
  }

  const readURL = (x: any) => {
    console.log(x[0])
  }

  return (
    <div className="form-container">
      {authInfo.authenticated && (
        <h1 className="profileName">Editing: {authInfo.username}</h1>
      )}
      <Form onSubmit={onFormSubmit}>
        <label>Select Profile Picture:</label>
        <Form.Control
          className="file-input"
          type="file"
          id="img"
          name="img"
          accept="image/*"
          onChange={(e) => readURL(e.target)}
        />
        <br />
        <Form.Group className="mb-3">
          <Form.Label>New Username</Form.Label>
          <Form.Control type="username" placeholder="Enter New Username" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default ProfilePage
