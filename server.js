const express = require('express')
const next = require('next')

const dotenv = require('dotenv')

dotenv.config()

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const Sequelize = require('sequelize')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const bodyParser = require('body-parser')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// const pipe = require('./utils/pipe.js')
const tryCatch = require('./utils/tryCatcher.js')
const conditionally = require('./utils/conditionally.js')

const sitemapAndRobots = require('./sitemapAndRobots.js')

const User = require('./models/user.js')
const House = require('./models/house.js')
const Review = require('./models/review.js')
const Booking = require('./models/booking.js')
const sequelize = require('./database.js')

// * Keeps our DB inline with our model files
sequelize.sync({ alter: true })
User.sync({ alter: true })
House.sync({ alter: true })
Review.sync({ alter: true })
Booking.sync({ alter: true })

const sessionStore = new SequelizeStore({
  db: sequelize,
})

sessionStore.sync()

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function(email, password, done) {
      if (!email || !password) {
        done('Email and password required', null)
        return
      }

      const user = await User.findOne({ where: { email } })

      if (!user) {
        done('User not found', null)
        return
      }

      const valid = await user.isPasswordValid(password)

      if (!valid) {
        done('Email and password do not match', null)
        return
      }

      done(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser(async (email, done) => {
  const prepareUser = tryCatch({
    tryer: async () => {
      const user = await User.findOne({ where: { email } })
      done(null, user)
    },
    catcher: error => {
      console.error(error.message)
    },
  })

  prepareUser(email)

  // try {
  //   const user = await User.findOne({ where: { email } })
  //   done(null, user)
  // } catch (error) {
  //   console.error(error)
  // }
})

nextApp.prepare().then(() => {
  const server = express()

  sitemapAndRobots({ server })

  server.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        req.rawBody = buf
      },
    })
  )

  server.use(
    session({
      secret: 'skdhjfgsd8f7yerhgruyq3r', // enter a random string here
      resave: false,
      saveUninitialized: false,
      name: 'nextbnb',
      cookie: {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
      store: sessionStore,
    }),
    passport.initialize(),
    passport.session()
  )

  server.post('/api/auth/register', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body

    const samePasswords = (p1, p2) => p1 == p2 // eslint-disable-line eqeqeq

    conditionally({
      if: samePasswords(password, passwordConfirmation),
      then: () => {
        res.end(
          JSON.stringify({ status: 'error', message: 'Passwords do not match' })
        )
        return
      },
      else: () => {},
    })

    // checkPasswords()

    // if (password !== passwordConfirmation) {
    //   res.end(
    //     JSON.stringify({ status: 'error', message: 'Passwords do not match' })
    //   )
    //   return
    // }

    tryCatch({
      tryer: async () => {
        const user = await User.create({ email, password })
        req.login(user, err => {
          conditionally({
            if: err,
            then: () => {
              res.statusCode = 500
              res.end(JSON.stringify({ status: 'error', message: err }))
              return
            },
            else: () => {
              return res.end(
                JSON.stringify({ status: 'success', message: 'Logged in' })
              )
            },
          })
        })
      },
      catcher: error => {
        res.statusCode = 500
        const message = conditionally({
          if: error.name === 'SequelizeUniqueConstraintError',
          then: () => 'User already exists',
          else: () => 'An error occurred',
        })
        res.end(JSON.stringify({ status: 'error', message }))
      },
    })

    // try {
    //   const user = await User.create({ email, password })

    //   req.login(user, err => {
    //     if (err) {
    //       res.statusCode = 500
    //       res.end(JSON.stringify({ status: 'error', message: err }))
    //       return
    //     }

    //     return res.end(
    //       JSON.stringify({ status: 'success', message: 'Logged in' })
    //     )
    //   })
    // } catch (error) {
    //   res.statusCode = 500
    //   let message = 'An error occurred'
    //   if (error.name === 'SequelizeUniqueConstraintError') {
    //     message = 'User already exists'
    //   }
    //   res.end(JSON.stringify({ status: 'error', message }))
    // }
  })

  server.post('/api/auth/login', async (req, res) => {
    // eslint-disable-next-line no-unused-vars
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        res.statusCode = 500
        res.end(
          JSON.stringify({
            status: 'error',
            message: err,
          })
        )
        return
      }

      if (!user) {
        res.statusCode = 500
        res.end(
          JSON.stringify({
            status: 'error',
            message: 'No user matching credentials',
          })
        )
        return
      }

      req.login(user, error => {
        if (error) {
          res.statusCode = 500
          res.end(
            JSON.stringify({
              status: 'error',
              message: error,
            })
          )
          return
        }

        return res.end(
          JSON.stringify({
            status: 'success',
            message: 'Logged in',
          })
        )
      })
    })(req, res, next)
  })

  server.post('/api/auth/logout', (req, res) => {
    req.logout()
    req.session.destroy()
    return res.end(JSON.stringify({ status: 'success', message: 'Logged out' }))
  })

  /*
   ******************************* Helper Functions *******************************
   */

  /**
   * @function getDatesBetweenDates
   * @param {string} startDate - First day in range to compute
   * @param {string} endDate - Last day in range to compute
   * @returns {string[]} - An array of dates, one for each day, between start and end dates
   */
  const getDatesBetweenDates = (startDate, endDate) => {
    let dates = []
    while (startDate < endDate) {
      dates = [...dates, new Date(startDate)]
      startDate.setDate(startDate.getDate() + 1)
    }
    return [...dates, endDate]
  }

  /**
   * @function canBookThoseDates
   * @param {number} houseId - The houseId from the database
   * @param {string} startDate - The first date to begin booking
   * @param {string} endDate - The last day to book
   * @returns {boolean} - If booking is availiabe returns true, else returns false
   */
  const canBookThoseDates = async (houseId, startDate, endDate) => {
    try {
      const results = await Booking.findAll({
        where: {
          houseId,
          startDate: {
            [Sequelize.Op.lte]: new Date(endDate),
          },
          endDate: {
            [Sequelize.Op.gte]: new Date(startDate),
          },
        },
      })

      return !(results.length > 0)
    } catch (error) {
      console.error(error)
    }

    // tryCatch({
    //   tryer: async () => {
    //     const results = await Booking.findAll({
    //       where: {
    //         houseId,
    //         startDate: {
    //           [Sequelize.Op.lte]: new Date(endDate),
    //         },
    //         endDate: {
    //           [Sequelize.Op.gte]: new Date(startDate),
    //         },
    //       },
    //     })
    //     return !(results.length > 0)
    //   },
    //   catcher: error => console.error(error),
    // })
  }

  server.post('/api/houses/check', async (req, res) => {
    const { startDate, endDate, houseId } = req.body

    let message = 'free'
    const canBook = await canBookThoseDates(houseId, startDate, endDate)
    if (canBook) message = 'busy'

    res.json({ status: 'success', message })
  })

  server.post('/api/houses/booked', async (req, res) => {
    const { houseId } = req.body

    const results = await Booking.findAll({
      where: {
        house: houseId,
        endDate: {
          [Sequelize.Op.gte]: new Date(),
        },
      },
    })

    let bookedDates = results.reduce((acc, result) => {
      const dates = getDatesBetweenDates(
        new Date(result.startDate),
        new Date(result.endDate)
      )
      return (acc = [...acc, ...dates])
    }, [])

    bookedDates = [...new Set(bookedDates.map(date => date))]

    res.send({
      state: 'success',
      message: 'ok',
      dates: bookedDates,
    })
  })

  server.get('/api/houses/:id', async (req, res) => {
    const { id } = req.params

    const house = await House.findByPk(id)
    if (house) {
      const reviews = await Review.findAndCountAll({
        where: {
          houseId: house.id,
        },
      })

      house.dataValues.reviews = reviews.rows.map(review => review.dataValues)
      house.dataValues.reviewsCount = reviews.count
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(house.dataValues))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `Not found` }))
    }
  })

  server.get('/api/houses', async (req, res) => {
    try {
      const result = await House.findAndCountAll()
      const houses = result.rows.map(house => house.dataValues)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(houses))
    } catch (error) {
      console.error(error)
    }
  })

  server.post('/api/stripe/session', async (req, res) => {
    const { amount } = req.body
    // eslint-disable-next-line global-require
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const sess = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          name: 'Booking house on Airbnb clone',
          amount: amount * 100,
          currency: 'usd',
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/bookings`,
      cancel_url: `${process.env.BASE_URL}/bookings`,
    })

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        status: 'success',
        sessionId: sess.id,
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      })
    )
  })

  server.post('/api/houses/reserve', async (req, res) => {
    if (!req.session.passport) {
      res.writeHead(403, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
      return
    }
    try {
      const { houseId, startDate, endDate, sessionId } = req.body
      const canBook = await canBookThoseDates(houseId, startDate, endDate)

      if (!canBook) {
        // busy (no bookings available)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            status: 'error',
            message: 'House is already booked',
          })
        )
        return
      }

      const userEmail = req.session.passport.user
      const user = await User.findOne({ where: { email: userEmail } })
      const { id: userId } = user
      if (user) {
        Booking.create({
          houseId,
          userId,
          startDate,
          endDate,
          sessionId,
        })
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'success', message: 'ok' }))
      }
    } catch (error) {
      console.error('Something happen with your connection?')
    }
  })

  server.post('/api/stripe/webhook', async (req, res) => {
    // eslint-disable-next-line global-require
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    const sig = req.headers['stripe-signature']
    let event
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      console.error(error.message)
      res.end(
        JSON.stringify({
          status: 'success',
          message: `Webhook Error: ${error.message}`,
        })
      )
      return
    }

    if (event.type === 'checkout.session.completed') {
      const { id } = event.data.object

      try {
        Booking.update({ paid: true }, { where: { sessionId: id } })
      } catch (error) {
        console.error(error)
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ received: true }))
  })

  server.post('/api/bookings/clean', (req, res) => {
    Booking.destroy({ where: { paid: false } })

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'success', message: 'ok' }))
  })

  server.get('/api/bookings/list', async (req, res) => {
    try {
      if (!req.session.passport || !req.session.passport.user) {
        res.writeHead(403, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
        return
      }

      const userEmail = req.session.passport.user
      const user = await User.findOne({ where: { email: userEmail } })

      const result = await Booking.findAndCountAll({
        where: { paid: false },
        userId: user.id,
        endDate: {
          [Sequelize.Op.gte]: new Date(),
        },
        order: [['startDate', 'ASC']],
      })

      const bookings = await Promise.all(
        result.rows.map(async booking => {
          const data = {}
          data.booking = booking.dataValues
          data.house = (await House.findByPk(data.booking.houseId)).dataValues
          return data
        })
      )

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(bookings))
    } catch (error) {
      console.error(error)
    }
  })

  server.get('/api/host/list', async (req, res) => {
    try {
      if (!req.session.passport || !req.session.passport.user) {
        res.writeHead(403, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
        return
      }

      const userEmail = req.session.passport.user
      const user = await User.findOne({ where: { email: userEmail } })

      const houses = await House.findAll({ where: { id: user.id } })
      const houseIds = houses.map(house => house.dataValues.id)
      const bookingsData = await Booking.findAll({
        where: {
          paid: false,
          houseId: {
            [Sequelize.Op.in]: houseIds,
          },
          endDate: {
            [Sequelize.Op.gte]: new Date(),
          },
        },
        order: [['startDate', 'ASC']],
      })

      const bookings = await Promise.all(
        bookingsData.map(async booking => {
          return {
            booking: booking.dataValues,
            house: houses.filter(
              house => house.dataValues.id === booking.dataValues.houseId
            )[0].dataValues,
          }
        })
      )

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ bookings, houses }))
    } catch (error) {
      console.error(error)
    }
  })

  server.post('/api/host/new', async (req, res) => {
    const houseData = req.body.house
    if (!req.session.passport) {
      res.writeHead(403, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
      return
    }

    const userEmail = req.session.passport.user
    const user = await User.findOne({ where: { email: userEmail } })
    if (!user) {
      res.writeHead(403, { 'Content-Type': 'application/json ' })
      res.end(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
      return
    }

    console.log('user.id = ', user.id)
    houseData.host = user.id

    const newHouse = House.create(houseData)
    if (newHouse) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'success', message: 'ok' }))
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({ status: 'error', message: 'Cannot create new house' })
      )
      return
    }
  })

  server.post('/api/host/edit', async (req, res) => {
    const houseData = req.body.house
    if (!req.session.passport) {
      res.writeHead(403, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
      return
    }

    const userEmail = req.session.passport.user
    const user = await User.findOne({ where: { email: userEmail } })
    const house = await House.findByPk(houseData.id)
    if (house) {
      if (house.host !== user.id) {
        res.writeHead(402, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
        return
      }

      House.update(houseData, { where: { id: houseData.id } })
        .then(() => {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ status: 'success', message: 'ok' }))
        })
        .catch(err => {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ status: 'error', message: err.name }))
        })
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Not found' }))
      return
    }
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
