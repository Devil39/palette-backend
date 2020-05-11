const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
var cors = require('cors');
app.use(cors());
const chalk = require('chalk');
const dotenv = require("dotenv");
dotenv.config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send({
        statusCode: 200,
        payload: {
            msg: "The Backend is healthy and running",
        },
    }).status(200)
})

//Route imports
const userRoute = require('./src/routes/userRoutes');

//Use Routes
app.use('/user', userRoute);


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Server is up on port ', port)
})