import { Sequelize, Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { user, password, host, database } from './database'

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'postgres',
  logging: false,
})

export class User extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: false,
    hooks: {
      beforeCreate: async user => {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        user.password = await bcrypt.hash(user.password, salt)
      },
    },
  }
)

User.prototype.isPasswordValid = async function(password) {
  return await bcrypt.compare(password, this.password)
}
