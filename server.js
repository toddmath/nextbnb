const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const User = require('./model.js').User
const session = require('express-session')
const sequelize = require('./model.js').sequelize
const SequelizeStore = require('connect-session-sequelize')(session.Store)

nextApp.prepare().then(() => {
  const server = express()
  const sessionStore = new SequelizeStore({ db: sequelize })
  // sessionStore.sync()
  server.use(
    session({
      secret: 'skdhjfgsd8f7yerhgruyq3r',
      resave: false,
      saveUninitialized: true,
      name: 'nextbnb',
      cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
      store: sessionStore,
    })
  )

  server.all('*', (req, res) => handle(req, res))
  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
