const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  const token =
    req.body.user.accessToken || req.query.token || req.headers["x-access-token"]

  if (!token) {
    return res.status(403).json("Token is required for authentication")
  }
  
  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY)
    if (user.email === req.body.user.email) {
      req.body.user = user;
    } else {
      return res.status(401).json("@@@Invalid Token")  
    }
  } catch (error) {
    console.log('@@middleware:', error)
    return res.status(401).json("@Invalid Token")
  }
  return next()
}

module.exports = verifyToken
