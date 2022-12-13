type InputOption = {
  label: string
  value: string
}

type FormSpecs = {
  label: string
  type: string
  defaultValue: string | Array<string>
  required?: boolean
  options?: Array<InputOption>
  props?: any
}

type SignupFormSpecs = {
  readonly [_ in keyof (UserRegistrationInfo & {
    passwordConfirmation: string
  })]-?: FormSpecs
}

type LoginFormSpecs = {
  readonly [_ in keyof LoginSpecs]: FormSpecs
}

type AllFormSpecs = SignupFormSpecs & LoginSpecs
