import { Fragment, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import { reduceFormSpecs } from '../../utils/forms'

const LOGIN_SPECS: LoginFormSpecs = {
  username: {
    label: 'Username or email',
    type: 'text',
    defaultValue: '',
    required: true,
  },
  password: {
    label: 'Password',
    type: 'password',
    defaultValue: '',
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
  // const { state }: any = useLocation()
  // const navigate = useNavigate()

  // useEffect(() => {
  //   // console.log('state', state)
  // }, [state])

  const onInputChange = (
    key: keyof SignupFormSpecs,
    value: string | Array<string>
  ) => {
    setLoginData((prev) => ({ ...prev, [key]: value }))
  }

  const onFormSubmit = (ev: any) => {
    ev.preventDefault()
    login(loginData)
      .then(() => {
        window.location.reload()
        console.log('login success')
        // navigate(state?.from ?? '/', { replace: true })
        // navigate(-1)
      })
      .catch(({ response }) => {
        console.error('login error', response)
      })
  }

  return (
    <div>
      <form id="login-form" onSubmit={onFormSubmit}>
        {LOGIN_KEYS.map((currKey) => {
          const currSpecs = LOGIN_SPECS[currKey]
          const inputId = `login-${currKey}`

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

        <button type="submit" form="login-form">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
