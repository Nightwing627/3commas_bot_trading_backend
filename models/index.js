const dbConfig = require("../config/db.config")

const Sequelize = require("Sequelize")

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})

const db = {
  Sequelize,
  sequelize,
  users: require("./user.model")(sequelize),
  userBot: require("./user_bot.model")(sequelize),
  emailToken: require("./email_token.model")(sequelize),
}

module.exports = db
