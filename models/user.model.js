const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const User = sequelize.define("users", {
    first_name: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    last_name: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "client",
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })

  return User
}
