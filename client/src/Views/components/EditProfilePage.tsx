import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useStore } from '../../services/appStore'
import '../styles/profilePage.scss'
import { useState } from 'react'
import { updateUserProfile } from '../../services/privateServices'
import { uploadFile } from '../../services/s3Service'
import { useNavigate } from 'react-router-dom'
import { isValidUserName } from '../../utils/errors'
import { emitRefreshUsers } from '../../services/sockets'

const EditProfilePage = () => {
  const {
    store: { authInfo },
    updateStore,
  } = useStore()

  const [username, setUsername] = useState(
    authInfo.authenticated ? authInfo.username : ''
  )
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileError, setProfileError] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)

  const navigate = useNavigate()

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()
    let formErrorPresent = false
    setSubmitButtonDisabled(true)

    try {
      isValidUserName(username)
    } catch (err) {
      formErrorPresent = true
      setProfileError(String(err))
    }

    if (authInfo.authenticated) {
      ;(async () => {
        let profilePhotoUrl = null

        if (profileImage)
          try {
            profilePhotoUrl = await uploadFile(
              profileImage,
              'profile',
              profileImage.name
            )
          } catch (err) {
            formErrorPresent = true
            setProfileError('An error occurred uploading the photo. Try again!')
          }

        const newProfilePic =
          profilePhotoUrl ?? authInfo.userProfilePhoto ?? null
        const newUserData = {
          _id: authInfo.authenticated ? authInfo.userId : '',
          username: username,
          usernameLower: username.toLowerCase(),
          profilePhotoUrl: newProfilePic,
        }

        if (!formErrorPresent)
          try {
            await updateUserProfile({ ...newUserData })
            setProfileImage(null)
            setUsername('')
            updateStore(['authInfo', 'username'], newUserData.username)
            updateStore(['authInfo', 'userProfilePhoto'], newProfilePic)
            emitRefreshUsers()
            navigate(-1)
          } catch (err: any) {
            if (err.response.status == 409) setProfileError(err.response.data)
            else console.error('profile error', err.response)
          }

        setSubmitButtonDisabled(false)
      })()
    }
  }

  return authInfo.authenticated ? (
    <div className="form-container profile-container">
      <div className="text-center">
        <img
          alt="CurrentProfileImage"
          src={
            authInfo.userProfilePhoto
              ? authInfo.userProfilePhoto
              : process.env.PUBLIC_URL + '/anon.png'
          }
        />
      </div>

      <br />
      <h1 className="profileName">{authInfo.username}</h1>

      {profileError && (
        <Form.Group className="mb-3 form-error">{profileError}</Form.Group>
      )}

      <Form onSubmit={onFormSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username-input">New Username</Form.Label>
          <Form.Control
            id="username-input"
            type="text"
            placeholder="Enter New Username"
            value={username}
            onChange={(event) => {
              setProfileError('')
              setUsername(event.target.value)
            }}
          />

          <br />
          <Form.Label htmlFor="img">Update Profile Picture:</Form.Label>
          <Form.Control
            className="file-input"
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={(e) => {
              setProfileError('')
              setProfileImage((e.target as any).files[0])
            }}
          />
        </Form.Group>
        <Button
          variant={submitButtonDisabled ? 'dark' : 'primary'}
          disabled={submitButtonDisabled}
          type="submit"
          onClick={onFormSubmit}
        >
          Submit
        </Button>
      </Form>
    </div>
  ) : (
    <></>
  )
}

export default EditProfilePage
