import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useStore } from '../../services/appStore'
import '../styles/profilePage.scss'
import { useState } from 'react'
import { updateUserProfile } from '../../services/privateServices'

const ProfilePage = () => {
  const [username, setUsername] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const {
    store: { authInfo },
  } = useStore()

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()
    console.log(username)
    console.log(imageUrl)
  }

  const handleChange = (e: any) => {
    setImageUrl(e.target.value)
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
          onChange={(e) => handleChange(e)}
        />
        <br />
        <Form.Group className="mb-3">
          <Form.Label>New Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter New Username"
            onChange={(event) => {
              setUsername(event.target.value)
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default ProfilePage
