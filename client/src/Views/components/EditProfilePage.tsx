import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useStore } from '../../services/appStore'
import '../styles/profilePage.scss'
import { useState } from 'react'
import { updateUserProfile } from '../../services/privateServices'
import { uploadFile } from '../../services/s3Service'
import { useNavigate } from 'react-router-dom'

const EditProfilePage = () => {
  const [username, setUsername] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const navigate = useNavigate()
  const {
    store: { authInfo },
  } = useStore()

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()
    console.log(username)
    console.log(profileImage)
    const usernameLower = username.toLowerCase()

    const newUserData = {
      username: username,
      usernameLower: usernameLower,
      profilePicture: profileImage,
    }

    // don't know if s3Directory arg is correct
    if (profileImage) {
      uploadFile(profileImage, 'profile', profileImage.name)
        .then((url) => {
          setProfileImage(null)
        })
        .catch((error) => {
          console.error('aws edit profile pic error: ', error)
        })
    }

    // we need type User to also have a profilePicture field
    if (username.trim().length > 0) {
      updateUserProfile(newUserData)
        .then((e) => {
          console.log(e)
          setProfileImage(null)
          setUsername('')
        })
        .catch((error) => {
          console.error('Updating Profile Server Error: ', error)
        })
    }
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
          onChange={(e) => setProfileImage((e.target as any).files[0])}
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
        <Button variant="primary" type="submit" onClick={() => navigate(-1)}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default EditProfilePage
