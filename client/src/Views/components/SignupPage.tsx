import { Fragment, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../styles/signup.module.scss'
import { reduceFormSpecs } from '../../utils/forms'
import { signup } from '../../services/authService'

const SIGNUP_SPECS: SignupFormSpecs = {
  username: {
    label: 'Username',
    type: 'text',
    defaultValue: '',
    required: true,
    props: { placeholder: 'joedoe1234' },
  },
  password: {
    label: 'Password',
    type: 'password',
    defaultValue: '',
    required: true,
  },
  passwordConfirmation: {
    label: 'Confirm Password',
    type: 'password',
    defaultValue: '',
    required: true,
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
  const { state }: any = useLocation()
  const navigate = useNavigate()

  const onInputChange = (
    key: keyof SignupFormSpecs,
    value: string | Array<string>
  ) => {
    setProfileData((prev) => ({ ...prev, [key]: value }))
  }

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()

    // error check

    signup(profileData)
      .then(() => {
        // navigate(state?.from ?? '/feed')
        window.location.reload()
      })
      .catch(({ response }) => {
        console.error('signup error', response)
      })
  }

  return (
    <div>
      <form
        id="signup-form"
        className={styles.formContainer}
        onSubmit={onFormSubmit}
      >
        {SIGNUP_KEYS.map((currKey) => {
          const currSpecs = SIGNUP_SPECS[currKey]
          const inputId = `user-${currKey}`

          return (
            <Fragment key={inputId}>
              <label htmlFor={inputId}>{currSpecs.label}</label>
              <input
                {...currSpecs.props}
                id={inputId}
                type={currSpecs.type}
                onChange={(ev) => onInputChange(currKey, ev.target.value)}
              />
            </Fragment>
          )
        })}

        <button type="submit" form="signup-form">
          Submit
        </button>
      </form>
    </div>
  )
}

export default SignupPage
