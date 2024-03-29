import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { reduceFormSpecs } from '../../utils/forms'
import { signup } from '../../services/authService'
import { emitRefreshUsers } from '../../services/sockets'
import { isValidPassword, isValidUserName } from '../../utils/errors'
import { uploadFile } from '../../services/s3Service'

const SIGNUP_SPECS: SignupFormSpecs = {
  username: {
    label: 'Username',
    type: 'text',
    defaultValue: '',
    validation: isValidUserName,
    required: true,
    props: { placeholder: 'joedoe123' },
  },
  password: {
    label: 'Password',
    type: 'password',
    defaultValue: '',
    validation: isValidPassword,
    required: true,
    props: { placeholder: 'Password' },
  },
  passwordConfirmation: {
    label: 'Confirm Password',
    type: 'password',
    defaultValue: '',
    required: true,
    props: { placeholder: 'Re-enter Password' },
  },
  profilePhotoUrl: {
    label: 'Profile Picture (Optional)',
    type: 'file',
    defaultValue: '',
  },
}

const SIGNUP_KEYS = Object.keys(SIGNUP_SPECS) as Array<keyof SignupFormSpecs>

const DEFAULT_FORM_STATE = reduceFormSpecs(
  SIGNUP_KEYS,
  (c: keyof SignupFormSpecs) => [c, SIGNUP_SPECS[c].defaultValue]
)

const DEFAULT_ERROR_STATE = reduceFormSpecs(SIGNUP_KEYS, (c) => [c, false])

const SignupPage = () => {
  const [profileData, setProfileData] = useState(DEFAULT_FORM_STATE)
  const [formErrors, setFormErrors] = useState(DEFAULT_ERROR_STATE)
  const [signupError, setSignupError] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)

  // update passwordConfirmation validation to use state
  SIGNUP_SPECS.passwordConfirmation.validation = () => {
    if (profileData.password !== profileData.passwordConfirmation)
      throw 'Passwords must match.'
  }

  const onInputChange = (key: keyof SignupFormSpecs, value: string) =>
    setProfileData((prev) => ({ ...prev, [key]: value }))

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()
    setSubmitButtonDisabled(true)

    // error check
    setFormErrors(DEFAULT_ERROR_STATE)
    let formErrorPresent = false
    for (const key of SIGNUP_KEYS)
      try {
        SIGNUP_SPECS[key].validation?.(profileData[key])
      } catch (err) {
        setFormErrors((prev) => ({ ...prev, [key]: String(err) }))
        formErrorPresent = true
      }

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
          setSignupError('An error occurred uploading the photo. Try again!')
        }

      if (!formErrorPresent)
        try {
          await signup({
            ...profileData,
            profilePhotoUrl,
            passwordConfirmation: undefined,
          })
          emitRefreshUsers()
          window.location.reload()
        } catch (err: any) {
          if (err.response.status == 409) setSignupError(err.response.data)
          else console.error('signup error', err.response)
        }

      setSubmitButtonDisabled(false)
    })()
  }

  return (
    <div className="form-container">
      <div className="text-center mb-3">
        <img
          src={process.env.PUBLIC_URL + '/TitanLogo.png'}
          width="150"
          height="150"
          alt="Responsive image"
        />
      </div>
      <h1>Sign Up</h1>

      <Form id="signup-form" onSubmit={onFormSubmit}>
        {SIGNUP_KEYS.map((currKey) => {
          const currSpecs = SIGNUP_SPECS[currKey]
          const inputId = `user-${currKey}`

          return (
            <Fragment key={inputId}>
              <Form.Group className="mb-4">
                {currSpecs.type != 'file' && (
                  <FloatingLabel label={currSpecs.label} controlId={inputId}>
                    <Form.Control
                      {...currSpecs.props}
                      type={currSpecs.type}
                      onChange={(ev) => onInputChange(currKey, ev.target.value)}
                    />
                  </FloatingLabel>
                )}
                {currSpecs.type == 'file' && (
                  <div>
                    <Form.Label htmlFor={inputId}>{currSpecs.label}</Form.Label>
                    <Form.Control
                      id={inputId}
                      {...currSpecs.props}
                      type={currSpecs.type}
                      onChange={(ev) =>
                        setProfileImage((ev.target as any).files[0])
                      }
                    />
                  </div>
                )}
                {formErrors[currKey] && (
                  <span className="field-error">{formErrors[currKey]}</span>
                )}
              </Form.Group>
            </Fragment>
          )
        })}

        {signupError && (
          <Form.Group className="mb-3 form-error">{signupError}</Form.Group>
        )}

        <Button
          className="mb-5"
          variant={submitButtonDisabled ? 'dark' : 'primary'}
          disabled={submitButtonDisabled}
          type="submit"
          form="signup-form"
        >
          Submit
        </Button>
      </Form>

      <Link to="/login">{'Already have an account? Login here!'}</Link>
    </div>
  )
}

export default SignupPage
