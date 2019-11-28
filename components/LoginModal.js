export default ({ showSignup }) => (
  <>
    <h2>Log in</h2>
    <div>
      <form
        onSubmit={event => {
          alert('Log in!')
          event.preventDefault()
        }}
      >
        <input id='email' type='email' placeholder='Email adress' />
        <input id='password' type='password' placeholder='Password' />
        <button>Log in</button>
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
