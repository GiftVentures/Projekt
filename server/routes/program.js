const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

const {AddProgram, DeleteProgram, AddTheme, getAllThemes} = require('../controllers/programController')

router.use(requireAuth)

router.post("/add", AddProgram)
router.delete("/delete/:id", DeleteProgram)

router.post("/theme/add", AddTheme)
router.get("/theme", getAllThemes)

module.exports = router
