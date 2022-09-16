const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const EmailToken = sequelize.define("email_token", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  })

  return EmailToken
}
