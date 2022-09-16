const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const UserBot = sequelize.define("user_bots", {
    user_id: {
      type: DataTypes.INTEGER
    },
    bot_name: {
      type: DataTypes.STRING
    },
    bot_id: {
      type: DataTypes.INTEGER
    },
    secret: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.DOUBLE
    },
    bot_required_amount: {
      type: DataTypes.DOUBLE
    },
    copied_bot_id: {
      type: DataTypes.INTEGER
    },
    max_active_deals: {
      type: DataTypes.INTEGER,
    },
    base_order_volume: {
      type: DataTypes.DOUBLE,
    },
    strategy: {
      type: DataTypes.STRING, // long, short 
    },
    profit_currency: {
      type: DataTypes.STRING, // quote_currency, base_currency 
    },
    start_order_type: {
      type: DataTypes.STRING, // limit, market
    }
  })

  return UserBot
}
