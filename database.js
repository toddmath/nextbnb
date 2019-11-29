// const Database = {
//   user: 'todd',
//   password: '',
//   host: 'localhost',
//   database: 'nextbnb',
// }

// module.exports = Database

const user = 'todd'
const password = ''
const host = 'localhost'
const database = 'nextbnb'

const Sequelize = require('sequelize')

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'postgres',
  logging: false,
})

module.exports = sequelize
