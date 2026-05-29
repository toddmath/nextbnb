const Sequelize = require('sequelize')
const sequelize = require('../database.js')

class Review extends Sequelize.Model {}

Review.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    house: { type: Sequelize.DataTypes.STRING, allowNull: true },
    userId: { type: Sequelize.DataTypes.STRING, allowNull: false },
    comment: { type: Sequelize.DataTypes.TEXT, allowNull: false },
    houseId: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'review',
    timestamps: true,
  }
)

module.exports = Review
