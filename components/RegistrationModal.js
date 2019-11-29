import { useState } from 'react'
import axios from 'axios'
import { useStoreActions } from 'easy-peasy'

export default ({ showLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const setUser = useStoreActions(actions => actions.user.setUser)
  const setHideModal = useStoreActions(actions => actions.modals.setHideModal)

  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form
          onSubmit={async event => {
            console.log(email, password, passwordConfirmation)
            try {
              const response = await axios.post('/api/auth/register', {
                email,
                password,
                passwordConfirmation,
              })
              // const { status, message } = response.data

              if (response.data.status === 'error') {
                alert(response.data.message)
                return
              }
              setUser(email)
              setHideModal()
              // console.log(response)
            } catch (error) {
              alert(error.response.data.message)
              return
            }
            event.preventDefault()
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
