const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {AddProgram, DeleteProgram, AddTheme, getAllThemes, uploadImage} = require('../controllers/programController')

router.use(requireAuth)

router.post("/add", AddProgram)
router.delete("/delete/:id", DeleteProgram)

router.post("/theme/add", AddTheme)
router.get("/theme", getAllThemes)

router.post("/img/upload", upload.single('image'), uploadImage)

module.exports = router
