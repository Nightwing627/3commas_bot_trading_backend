const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../models")
const User = db.users

const tokenList = {}

const AuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      if (!(email && password)) {
        return res.status(400).send("Please input the credentials")
      }

      const user = await User.findOne({ where: { email } })

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
          { user_id: user.id, email },
          process.env.TOKEN_KEY,
          { expiresIn: process.env.EXPIRE_TIME }
        )

        const refreshToken = jwt.sign(
          { user_id: user.id, email },
          process.env.REFRESH_TOKEN_KEY,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRED_TIME }
        )

        user.token = accessToken
        user.refresh_token = refreshToken

        await User.update(
          { token: accessToken, refresh_token: refreshToken },
          { where: { id: user.id } }
        )

        return res.status(200).json({
          userData: {
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          },
          accessToken,
          refreshToken,
        })
      }

      res.status(400).send("Email or Password is Invalid")
    } catch (error) {
      console.error(error)
    }
  },

  register: async (req, res) => {
    try {
      const { password, username } = req.body
      const email = req.body.email.toLowerCase()

      if (!(email && password && username)) {
        return res.status(400).send("Please input all informations")
      }

      let checkUser = await User.findOne({ where: { email } })
      if (checkUser) {
        return res
          .status(200)
          .json({ error: { email: "This email is already in use." } })
      }

      checkUser = await User.findOne({ where: { username } })
      if (checkUser) {
        return res
          .status(200)
          .json({ error: { username: "This username is already in use." } })
      }

      const enryptedPWD = await bcrypt.hash(password, 10)

      const newUser = await User.create({
        username,
        email,
        password: enryptedPWD,
      })

      const accessToken = jwt.sign(
        { user_id: newUser.id, email },
        process.env.TOKEN_KEY,
        { expiresIn: process.env.EXPIRE_TIME }
      )

      await User.update({ token: accessToken }, { where: { id: newUser.id } })

      return res.status(200).json({
        user: {
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
          role: newUser.role,
        },
        accessToken,
      })
    } catch (error) {
      console.log(error)
    }
  },

  refreshToken: async (req, res) => {
    let { refreshToken } = req.body;
    
    if (refreshToken.includes('"')) {
      refreshToken = refreshToken.split('"')[1]
    }
    try {
      const user = await User.findOne({ where: {
        refresh_token: refreshToken
      } })

      const newAccessToken = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.TOKEN_KEY,
        { expiresIn: process.env.EXPIRE_TIME }
      )

      const newRefreshToken = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRED_TIME }
      )
      
      await User.update({ token: newAccessToken, refresh_token: newRefreshToken }, { where: { id: user.id } })
      
      console.log(newAccessToken, newRefreshToken)
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      })
    } catch( err ) {
      return res.status(400).json('Invalid Reqeust')
    }
  }
}

module.exports = AuthController
