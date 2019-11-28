import { User } from '../../../model'

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const { email, password, passwordConfirmation } = req.body

  if (password !== passwordConfirmation) {
    res.end(
      JSON.stringify({ status: 'error', message: 'Passwords do not match' })
    )
    return
  }

  try {
    const user = await User.create({ email, password })
    res.end(JSON.stringify({ status: 'succuess', message: 'User added' }))
  } catch (error) {
    res.statusCode = 500
    let message = 'An error occured'
    if (error.name === 'SequelizeUniqueConstraintError') {
      message = 'User already exists'
    }
    res.end(JSON.stringify({ status: 'error', message }))
  }

  // console.log(req.body)
  // res.end()
}
