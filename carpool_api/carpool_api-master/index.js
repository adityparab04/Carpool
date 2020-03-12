const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

//Import all the router files
const driver = require('./api/routes/driver');
const passenger = require('./api/routes/passenger');
const user = require('./api/routes/user');

//Intialise the app
const app = express();

app.use(cors());

dotenv.config();

//connect to the database
mongoose.connect(`mongodb://${process.env.DB_USR}:${process.env.DB_PASS}@ds357955.mlab.com:57955/carpool`)
    .then(() => {
        console.log('connected successfully to the database');
    })
    .catch(err => {
        console.error(err);
    });
mongoose.Promise = global.Promise;

// bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//routes
app.use('/driver', driver);
app.use('/passenger', passenger);
app.use('/user', user);


app.get('*', (req, res) => {
  res.status(200).json({
    status: 'working',
    app_name: 'viva carpool',
    res: 'not a correct endpoint'
  });
});

//port variable
const port = process.env.PORT;

//listen to the request
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});