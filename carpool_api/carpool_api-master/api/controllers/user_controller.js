const CreateRide = require('../models/Create_Ride');
const RequestRide = require('../models/Request_Ride');
const Driver = require('../models/Driver');
const Passenger = require('../models/Passenger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getCreatedRide = async (req, res) => {
  try {
    let createdRide = await CreateRide.find({});
    res.status(200).json({
      createdRide
    });
  } catch (err) {
    res.status(500).json({
      err
    })
  }
}

exports.getRequestedRide = async (req, res) => {
  try {
    let requestedRide = await RequestRide.find({});
    res.status(200).json({
      requestedRide
    });
  } catch (err) {
    res.status(500).json({
      err
    })
  }
}

exports.login = async(req, res) => {
  try {
    const driver = await Driver.find({username: req.body.username});
    const passenger = await Passenger.find({username: req.body.username});
    let user;
    let usertype;
    let userid;
    if(driver.length > 0) {
      user = driver[0];
      usertype = 'driver';
      userid = driver[0].driver_id;
    } else if(passenger.length > 0) {
      user = passenger[0];
      usertype = 'passenger';
      userid = passenger[0].passenger_id;
    } else {
      return res.status(404).json({
        message: 'authentication failed'
    });
    }
    const result = await bcrypt.compareSync(req.body.password, user.password);
    if (result) {
        const token = await jwt.sign(
            {
                username: user.username,
                userid,
                usertype
            },
            process.env.JWT_KEY
        );
        res.status(200).json({
            message: 'authentication complete',
            username: user.username,
            userid,
            usertype,
            token: token
        });
    } else {
        res.status(401).json({
            message: 'authentication failed'
        });
    }
  } catch(err) {
    res.status(500).json({
        error: err,
        message: 'something went wrong'
    });
  }
};
