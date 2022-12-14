import { useState } from 'react'
import { login } from '../../services/authService'
import { isValidPassword, isValidUserName } from '../../utils/errors'
import { reduceFormSpecs } from '../../utils/forms'

const LOGIN_SPECS: LoginFormSpecs = {
  username: {
    label: 'Username or email',
    type: 'text',
    defaultValue: '',
    validation: isValidUserName,
    required: true,
  },
  password: {
    label: 'Password',
    type: 'password',
    defaultValue: '',
    validation: isValidPassword,
    required: true,
  },
}

const LOGIN_KEYS = Object.keys(LOGIN_SPECS) as Array<keyof LoginFormSpecs>

const DEFAULT_FORM_STATE = reduceFormSpecs(
  LOGIN_KEYS,
  (c: keyof LoginFormSpecs) => [c, LOGIN_SPECS[c].defaultValue]
)

const LoginPage = () => {
  const [loginData, setLoginData] = useState(DEFAULT_FORM_STATE)
  const [loginError, setLoginError] = useState('')

  const onInputChange = (
    key: keyof SignupFormSpecs,
    value: string | Array<string>
  ) => setLoginData((prev) => ({ ...prev, [key]: value }))

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()

    // error check
    setLoginError('')
    for (const key of LOGIN_KEYS)
      try {
        LOGIN_SPECS[key].validation?.(loginData[key])
      } catch (err) {
        return setLoginError('Invalid username or password')
      }

    login(loginData)
      .then(() => {
        window.location.reload()
      })
      .catch(({ response }) => {
        console.error('login error', response)
        setLoginError('Invalid username or password')
      })
  }

  return (
    <div>
      <form id="login-form" onSubmit={onFormSubmit}>
        {LOGIN_KEYS.map((currKey) => {
          const currSpecs = LOGIN_SPECS[currKey]
          const inputId = `login-${currKey}`

          return (
            <div key={inputId}>
              <label htmlFor={inputId}>{currSpecs.label}</label>
              <input
                {...currSpecs.props}
                id={inputId}
                type={currSpecs.type}
                onChange={(ev) => onInputChange(currKey, ev.target.value)}
              />
            </div>
          )
        })}
        {loginError && <div>{loginError}</div>}

        <button type="submit" form="login-form">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
