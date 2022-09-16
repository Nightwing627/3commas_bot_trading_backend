const express = require("express")
const AuthController = require("../controllers/auth.controller")

const router = express.Router()

router.post("/login", AuthController.login)
router.post("/register", AuthController.register)
router.post("/refresh-token", AuthController.refreshToken)

module.exports = router
