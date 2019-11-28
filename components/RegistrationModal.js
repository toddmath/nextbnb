import { useState } from 'react'
import axios from 'axios'

export default ({ showLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const submit = async () => {
    const response = await axios.post('/api/auth/register', {
      email,
      password,
      passwordConfirmation,
    })
    console.log(response)
  }

  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form
          onSubmit={event => {
            // alert('Sign up!')
            console.log(email, password, passwordConfirmation)
            event.preventDefault()
            submit()
          }}
        >
          <input
            id='email'
            type='email'
            placeholder='Email address'
            onChange={event => setEmail(event.target.value)}
          />
          <input
            id='password'
            type='password'
            placeholder='Password'
            onChange={event => setPassword(event.target.value)}
          />
          <input
            id='passwordconfirmation'
            type='password'
            placeholder='Enter password again'
            onChange={event => setPasswordConfirmation(event.target.value)}
          />
          <button>Sign up</button>
        </form>
        <p>
          Already have an account?{' '}
          <a href='#' onClick={() => showLogin()}>
            Log in
          </a>
        </p>
      </div>
    </>
  )
}
