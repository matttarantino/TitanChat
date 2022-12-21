import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { login } from '../../services/authService'
import { isValidPassword, isValidUserName } from '../../utils/errors'
import { reduceFormSpecs } from '../../utils/forms'
import { useStore } from '../../services/appStore'

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
  const { updateStore } = useStore()
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
        if (response.status === 401)
          setLoginError('Invalid username or password')
        else console.error('login error', response)
      })
  }

  return (
    <div className="form-container">
      <div className="text-center my-3">
        <img
          src={process.env.PUBLIC_URL + '/TitanLogo.png'}
          className=""
          width="150"
          height="150"
          alt="Responsive image"
        ></img>
      </div>
      <h1>Login</h1>

      <Form id="login-form" onSubmit={onFormSubmit}>
        {LOGIN_KEYS.map((currKey) => {
          const currSpecs = LOGIN_SPECS[currKey]
          const inputId = `login-${currKey}`

          return (
            <Fragment key={inputId}>
              <FloatingLabel
                className="mb-4"
                label={currSpecs.label}
                controlId={inputId}
              >
                <Form.Control
                  {...currSpecs.props}
                  type={currSpecs.type}
                  onChange={(ev) => onInputChange(currKey, ev.target.value)}
                />
              </FloatingLabel>
            </Fragment>
          )
        })}

        {loginError && (
          <Form.Group className="mb-3 form-error">{loginError}</Form.Group>
        )}

        <Button
          className="mb-5"
          variant="primary"
          type="submit"
          form="login-form"
        >
          Enter
        </Button>
      </Form>

      <Link to="/signup">{`Don't have an account? Sign up here!`}</Link>
    </div>
  )
}

export default LoginPage
