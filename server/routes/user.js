const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
//controller functions
const {signupUser, loginUser, getUserData, updateUser} = require('../controllers/userController')

// login route
router.post("/login", loginUser)

// signup route
router.post("/signup", signupUser)

//require authentication for getting the user data
router.use(requireAuth)

// get data route
router.get("/data", getUserData);

//update user
router.post("/update", updateUser);
module.exports = router


