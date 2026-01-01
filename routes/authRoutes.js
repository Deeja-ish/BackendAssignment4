const express = require("express")
const { registerUser, loginUser, resetPassword, forgotPassword } = require("../controllers/authController")
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/resetPassword/:token", resetPassword)
router.post("/forgotPassword", forgotPassword)

module.exports = router
