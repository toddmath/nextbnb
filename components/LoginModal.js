import { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useStoreActions } from 'easy-peasy'
import mixins from '../styles/mixins'

const StyledLoginButton = styled.button`
  ${mixins.smallButton};
  font-size: 14px;
  text-transform: uppercase;
`

export default ({ showSignup }) => {
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  const [account, setAccount] = useState({ email: '', password: '' })
  const setUser = useStoreActions(actions => actions.user.setUser)
  const setHideModal = useStoreActions(actions => actions.modals.setHideModal)

  return (
    <>
      <h2>Log in</h2>
      <div>
        <form
          onSubmit={async event => {
            if (event) event.preventDefault()
            try {
              const { email, password } = account
              const response = await axios.post('/api/auth/login', {
                email,
                password,
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
            placeholder='Email adress'
            name='email'
            onChange={e =>
              setAccount({ ...account, [e.target.name]: e.target.value })
            }
          />
          <input
            id='password'
            type='password'
            placeholder='Password'
            name='password'
            onChange={e =>
              setAccount({ ...account, [e.target.name]: e.target.value })
            }
          />
          <StyledLoginButton>Log in</StyledLoginButton>
        </form>
        <p>
          Don&lsquo;t have an account yet?{' '}
          <a href='#' onClick={() => showSignup()}>
            Sign up
          </a>
        </p>
      </div>
    </>
  )
}
