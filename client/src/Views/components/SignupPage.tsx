import { useState } from 'react'
import { reduceFormSpecs } from '../../utils/forms'
import { signup } from '../../services/authService'
import { isValidPassword, isValidUserName } from '../../utils/errors'

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

  // update passwordConfirmation validation to use state
  SIGNUP_SPECS.passwordConfirmation.validation = () => {
    if (profileData.password !== profileData.passwordConfirmation)
      throw 'Passwords must match.'
  }

  const onInputChange = (key: keyof SignupFormSpecs, value: string) =>
    setProfileData((prev) => ({ ...prev, [key]: value }))

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()

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

    // send signup request if there are no errors
    if (!formErrorPresent)
      signup({ ...profileData, passwordConfirmation: undefined })
        .then(() => {
          window.location.reload()
        })
        .catch(({ response }) => {
          console.error('signup error', response)
          setSignupError(response.data)
        })
  }

  return (
    <div>
      <form id="signup-form" onSubmit={onFormSubmit}>
        {SIGNUP_KEYS.map((currKey) => {
          const currSpecs = SIGNUP_SPECS[currKey]
          const inputId = `user-${currKey}`

          return (
            <div key={inputId}>
              <label htmlFor={inputId}>{currSpecs.label}</label>
              <input
                {...currSpecs.props}
                id={inputId}
                type={currSpecs.type}
                onChange={(ev) => onInputChange(currKey, ev.target.value)}
              />
              {formErrors[currKey] && <span>{formErrors[currKey]}</span>}
            </div>
          )
        })}
        {signupError && <div>{signupError}</div>}

        <button type="submit" form="signup-form">
          Submit
        </button>
      </form>
    </div>
  )
}

export default SignupPage