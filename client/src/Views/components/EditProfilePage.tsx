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
  const [profileProtoUrl, setProfileProtoUrl] = useState('')
  const [profileError, setProfileError] = useState('')
  const navigate = useNavigate()
  const {
    store: { authInfo },
  } = useStore()

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()
    const usernameLower = username.toLowerCase()

    const newUserData = {
      _id: authInfo.authenticated ? authInfo.userId : '',
      username: username,
      usernameLower: usernameLower,
      profilePhotoUrl: profileProtoUrl,
    }

    if (profileImage)
      uploadFile(profileImage, 'profile', profileImage.name)
        .then((url) => {
          setProfileProtoUrl(url)
        })
        .catch(() => {
          setProfileError('An error occurred uploading the photo. Try again!')
        })


    // if (username.trim().length > 0) {
    updateUserProfile(newUserData)
      .then(() => {
        setProfileImage(null)
        setUsername('')
        navigate(-1)
      })
      .catch((error) => {
        setProfileError(error.data)
      })
    // }
  }

  return (
    <div className="form-container">
      {authInfo.authenticated && (
        <h1 className="profileName">Editing: {authInfo.username}</h1>
      )}

      {profileError && (
        <Form.Group className="mb-3 form-error">{profileError}</Form.Group>
      )}

      <Form onSubmit={onFormSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>New Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter New Username"
            onChange={(event) => {
              setProfileError('');
              setUsername(event.target.value)
            }}
          />
          <br />
          <Form.Label>Update Profile Picture:</Form.Label>
          <Form.Control
            className="file-input"
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={(e) => {
              setProfileError('');
              setProfileImage((e.target as any).files[0])
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={onFormSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default EditProfilePage
