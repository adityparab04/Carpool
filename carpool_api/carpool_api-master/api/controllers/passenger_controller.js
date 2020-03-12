const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');
const RequestRide = require('../models/Request_Ride');
const CreateRide = require('../models/Create_Ride');
const AcceptRide = require('../models/accept_Ride');
const bcrypt = require('bcryptjs');

var pusher = require('../../pusher');

exports.check = async (req, res) => {
  try {
    const passenger = await Passenger.find({});
    res.status(200).json({
      passenger,
    })
  } catch (err) {
    res.status(500).json({
      err
    });
  }
};

exports.register = async (req, res) => {
  try {
    const username1 = await Passenger.find({username: req.body.username});
    const username2 = await Driver.find({username: req.body.username});

    if(username1.length >= 1 || username2.length >=1) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const new_user = await new Passenger({
        username: req.body.username,
        name: req.body.name,
        password: hash,
        mobile_no: req.body.mobile_no,
    });

    const result = await new_user.save();
    res.status(201).json({
        message: 'User created'
    });

  } catch(err) {
    if(err.errors.email.name == 'ValidatorError') {
        res.status(500).json({
            message: 'invalid email address'
        });
    }

    res.status(500).json({
        error: err
    });

  };
}

exports.request_ride = async(req, res) => {
  try {
    const passenger = await Passenger.find({passenger_id: req.body.passenger_id});

    if(passenger.length > 0) {
      const ride1 = await RequestRide.find({passenger_id: passenger[0].passenger_id});
      const ride2 = await AcceptRide.find({passenger_id: passenger[0].passenger_id});

      if(ride1.length > 0 || ride2.length > 0) {
        return res.status(500).json({
          message: 'ride already requested or accepted by you'
        });

      } else {
        const new_ride = await new RequestRide({
          passenger_id: passenger[0].passenger_id,
          requested_by: passenger[0].username,
          source: req.body.source,
          destination: req.body.destination,
          timing: req.body.timing,
          fare: req.body.fare,
        });

        const result = await new_ride.save();

        await pusher.trigger('driver', 'requestedRide', {
          message: 'ride has been requested'
        });
        console.log('trigger for requested ride has occured');

        res.status(201).json({
          message: 'ride created'
        });

      }
    } else {
      res.status(401).json({
        message: 'passenger does not exist'
      });

    }
  } catch(err) {
    res.status(500).json({
      err
    });

  }
}

exports.delete_request_ride = async (req, res) => {
  try {
    const passenger = await Passenger.find({passenger_id: req.body.passenger_id});
    const ride = await RequestRide.find({request_ride_id: req.body.request_ride_id});

    if(passenger[0].passenger_id == ride[0].passenger_id) {
      await RequestRide.remove({request_ride_id: req.body.request_ride_id});

      await pusher.trigger('driver', 'requestedRide', {
        message: 'requested ride has been deleted'
      });
      console.log('trigger for deletion of requested ride has occured');


      res.status(200).json({
        message: 'requested ride has been deleted successfully'
      });

    } else {
      res.status(401).json({
        message: 'passenger does not have access to this ride'
      });

    }

  } catch(err) {
    res.status(500).json({
      err,
      message: 'something went wrong',
    });

  }
}

exports.get_requested_ride_passenger = async (req, res) => {
  try {
    const ride = await RequestRide.find({passenger_id: req.params.id});
    res.status(200).json({
      ride: ride[0]
    });

  } catch(err) {
    res.status(500).json({
      err,
      message: 'something went wrong'
    });

  }
}

exports.accept_ride = async (req, res) => {
  try {
    const ride = await CreateRide.find({create_ride_id: req.body.create_ride_id});

    if(ride.length > 0) {
      const passenger = await Passenger.find({passenger_id: req.body.passenger_id});
      const driver = await Driver.find({driver_id: ride[0].driver_id});

      if(driver.length > 0 && passenger.length > 0) {
        const accept_ride = await AcceptRide.find({passenger_id: req.body.passenger_id});

        if (accept_ride.length > 0) {
          res.status(401).json({
            message: 'you have already accepted the one ride'
          });

        } else {
          const new_ride = await new AcceptRide({
            driver_id: driver[0].driver_id,
            passenger_id: passenger[0].passenger_id,
            driver_name: driver[0].username,
            passenger_name: passenger[0].username,
            driver_mobile_no: driver[0].mobile_no,
            passenger_mobile_no: passenger[0].mobile_no,
            source: ride[0].source,
            destination: ride[0].destination,
            timing: ride[0].timing,
            fare: ride[0].fare,
          });
  
          const passenger_ride = await RequestRide.find({passenger_id: req.body.passenger_id});
  
          if(passenger_ride.length > 0) {
            await RequestRide.remove({passenger_id: req.body.passenger_id});

            await pusher.trigger('driver', 'requestedRide', {
              message: 'requested ride has been deleted'
            });
            console.log('trigger for deletion of requested ride has occured');
          }
  
          await CreateRide.remove({create_ride_id: req.body.create_ride_id});

          await pusher.trigger('passenger', 'createRide', {
            message: 'created ride has been deleted',
          });
          console.log('trigger for deletion of created ride has occured');

          const result = await new_ride.save();

          const eventname1 = 'acceptRide'+ride[0].driver_id;

          await pusher.trigger('driver', eventname1.toString(), {
            message: 'your ride has been accepted',
          });
          console.log('trigger for accepted ride to the driver has occured');

          const eventname2 = 'acceptRide'+req.body.passenger_id;

          await pusher.trigger('passenger', eventname2.toString(), {
            message: 'your ride has been accepted',
          });
          console.log('trigger for accepted ride to the passenger has occured');

          res.status(201).json({
            message: 'ride accepted'
          });

        }
      } else {
        res.status(404).json({
          message: 'passenger not found'
        });

      }
    } else {
      res.status(404).json({
        message: 'created ride not found'
      });

    }
  } catch (err) {
    res.status(500).json({
      err,
      message: 'something went wrong'
    });

  }
}

exports.delete_accept_ride = async (req, res) => {
  try {
    const passenger = await Passenger.find({passenger_id: req.body.passenger_id});
    const ride = await AcceptRide.find({accept_ride_id: req.body.accept_ride_id});

    if(passenger[0].passenger_id == ride[0].passenger_id) {
      await AcceptRide.remove({accept_ride_id: req.body.accept_ride_id});

      const eventname = 'acceptRide'+ride[0].driver_id;

      await pusher.trigger('driver', eventname, {
        message: 'your ride has been canceled',
        driver_id: ride[0].driver_id
      });
      console.log('trigger for cancelation of accepted ride to the driver has occured');


      res.status(200).json({
        message: 'accepted ride has been deleted successfully'
      });

    } else {
      res.status(401).json({
        message: 'passenger does not have access to this ride'
      });

    }
  } catch(err) {
    res.status(500).json({
      err,
      message: 'something went wrong',
    });

  }
}

exports.get_accepted_ride_passenger = async (req, res) => {
  try {
    const ride = await AcceptRide.find({passenger_id: req.params.id});
    res.status(200).json({
      ride: ride[0]
    })
  } catch(err) {
    res.status(500).json({
      err,
      message: 'something went wrong'
    })
  }
}

exports.get_all_information_passenger = async (req, res) => {
  try {
    const passenger = await Passenger.find({passenger_id: req.params.id});
    const requested_ride = await RequestRide.find({passenger_id: req.params.id});
    const accepted_ride = await AcceptRide.find({passenger_id: req.params.id});

    res.status(200).json({
      passenger: {
        "username": passenger[0].username,
        "name": passenger[0].name,
        "mobile_no": passenger[0].mobile_no,
        "passenger_id": passenger[0].passenger_id
      },
      requested_ride: requested_ride.length > 0 ? {
        "passenger_id": requested_ride[0].passenger_id,
        "requested_by": requested_ride[0].requested_by,
        "source": requested_ride[0].source,
        "destination": requested_ride[0].destination,
        "timing": requested_ride[0].timing,
        "fare": requested_ride[0].fare,
        "request_ride_id": requested_ride[0].request_ride_id
      } : {},
      accepted_ride: accepted_ride.length > 0 ? {
        "driver_id": accepted_ride[0].driver_id,
        "passenger_id": accepted_ride[0].passenger_id,
        "driver_name": accepted_ride[0].driver_name,
        "passenger_name": accepted_ride[0].passenger_name,
        "driver_mobile_no": accepted_ride[0].driver_mobile_no,
        "passenger_mobile_no": accepted_ride[0].passenger_mobile_no,
        "source": accepted_ride[0].source,
        "destination": accepted_ride[0].destination,
        "timing": accepted_ride[0].timing,
        "fare": accepted_ride[0].fare,
        "accept_ride_id": accepted_ride[0].accept_ride_id,
      } : {}
    });

  } catch (err) {
    res.status(500).json({
      err,
      message: 'something went wrong'
    });
    
  }
}
