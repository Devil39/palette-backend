const express = require('express');
const app = express();
const bodyParser = require("body-parser")
var cors = require('cors');
const userRoute = require('./src/routes/userRoutes');
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send({
        payload: {
            msg: "The Backend is healthy and running",
        },
    })
})

app.use('/user', userRoute);

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Server is up on port ', port)
})