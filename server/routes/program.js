const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

const {AddProgram, DeleteProgram} = require('../controllers/programController')

router.use(requireAuth)

router.post("/add", AddProgram)

router.delete("/delete/:id", DeleteProgram)

module.exports = router
