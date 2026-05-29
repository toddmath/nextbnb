import { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useStoreActions } from 'easy-peasy'
import mixins from '../styles/mixins'

const StyledRegistrationButton = styled.button`
  ${mixins.smallButton};
  font-size: 14px;
  text-transform: uppercase;
`

export default ({ showLogin }) => {
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [account, setAccount] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const setUser = useStoreActions(actions => actions.user.setUser)
  const setHideModal = useStoreActions(actions => actions.modals.setHideModal)

  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form
          onSubmit={async event => {
            if (event) event.preventDefault()
            const { email, password, passwordConfirmation } = account
            console.log(email, password, passwordConfirmation)

            try {
              const response = await axios.post('/api/auth/register', {
                email,
                password,
                passwordConfirmation,
              })
              if (response.data.status === 'error') {
                alert(response.data.message)
                return
              }

              setUser(email)
              setHideModal()
            } catch (error) {
              alert(error.response.data.message)
              return
            }
          }}
        >
          <input
            id='email'
            type='email'
            name='email'
            placeholder='Email address'
            autoComplete='email'
            onChange={e =>
              setAccount({ ...account, [e.target.name]: e.target.value })
            }
          />
          <input
            id='password'
            type='password'
            name='password'
            placeholder='Password'
            autoComplete='new-password'
            onChange={e =>
              setAccount({ ...account, [e.target.name]: e.target.value })
            }
          />
          <input
            id='passwordconfirmation'
            type='password'
            name='passwordConfirmation'
            placeholder='Enter password again'
            autoComplete='new-password'
            onChange={e =>
              setAccount({ ...account, [e.target.name]: e.target.value })
            }
          />
          <StyledRegistrationButton type='submit'>
            Sign up
          </StyledRegistrationButton>
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
