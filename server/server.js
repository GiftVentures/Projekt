require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const programRoutes = require('./routes/program')
const PORT = process.env.PORT || 3500
const app = express()


// database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Successful database connection!"))
    .catch((error) => console.log(error.message));
    
//express app


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
//routes
app.use('/api/user', userRoutes)
app.use('/api/program', programRoutes)

//app listening
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});