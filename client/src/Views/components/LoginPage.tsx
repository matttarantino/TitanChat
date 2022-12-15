import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { login } from '../../services/authService'
import { isValidPassword, isValidUserName } from '../../utils/errors'
import { reduceFormSpecs } from '../../utils/forms'
import '../styles/loginPage.scss'
import { Link } from 'react-router-dom'

const LOGIN_SPECS: LoginFormSpecs = {
  username: {
    label: 'Username',
    type: 'text',
    defaultValue: '',
    validation: isValidUserName,
    required: true,
    props: { placeholder: 'Enter username' },
  },
  password: {
    label: 'Password',
    type: 'password',
    defaultValue: '',
    validation: isValidPassword,
    required: true,
    props: { placeholder: 'Enter password' },
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
    <div className="login-form-container">
      <Form id="login-form" onSubmit={onFormSubmit}>
        {LOGIN_KEYS.map((currKey) => {
          const currSpecs = LOGIN_SPECS[currKey]
          const inputId = `login-${currKey}`

          return (
            <Form.Group className="mb-3" key={inputId}>
              <Form.Label htmlFor={inputId}>{currSpecs.label}</Form.Label>
              <Form.Control
                {...currSpecs.props}
                id={inputId}
                type={currSpecs.type}
                onChange={(ev) => onInputChange(currKey, ev.target.value)}
              />
            </Form.Group>
          )
        })}

        {loginError && (
          <Form.Group className="mb-3 login-form-error">
            {loginError}
          </Form.Group>
        )}

        <Button
          className="mt-2 mb-4"
          variant="primary"
          type="submit"
          form="login-form"
        >
          Login
        </Button>
      </Form>

      <Link to="/signup">{`Don't have an account? Sign up here!`}</Link>
    </div>
  )
}

export default LoginPage
