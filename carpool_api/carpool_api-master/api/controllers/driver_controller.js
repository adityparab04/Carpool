const Driver = require('../models/Driver');
const Passenger = require('../models/Passenger');
const CreateRide = require('../models/Create_Ride');
const RequestRide = require('../models/Request_Ride');
const AcceptRide = require('../models/accept_Ride');
const bcrypt = require('bcryptjs');

var pusher = require('../../pusher');

exports.check = async (req, res) => {
  try {

    const users = await Driver.find({});
    res.status(200).json({
      users
    })

  } catch (err) {

    res.status(500).json({
      err
    });

  }
};

exports.register = async (req, res) => {
  try {
    
    const username1 = await Driver.find({username: req.body.username});
    const username2 = await Passenger.find({username: req.body.username});

    if(username1.length >= 1 || username2.length >=1) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const new_user = await new Driver({
        username: req.body.username,
        name: req.body.name,
        password: hash,
        mobile_no: req.body.mobile_no,
        vehicle_type: req.body.vehicle_type,
        license_no: req.body.license_no
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

exports.create_ride = async(req, res) => {
  try {

    const driver = await Driver.find({driver_id: req.body.driver_id});

    if(driver.length > 0) {

      const ride1 = await CreateRide.find({driver_id: driver[0].driver_id});
      const ride2 = await AcceptRide.find({driver_id: driver[0].driver_id});

      if(ride1.length > 0 || ride2.length > 0) {

        res.status(500).json({
          message: 'You have already created or accepted the ride'
        });

      } else {

        const new_ride = await new CreateRide({
          driver_id: driver[0].driver_id,
          created_by: driver[0].username,
          source: req.body.source,
          destination: req.body.destination,
          timing: req.body.timing,
          fare: req.body.fare,
          available_seats: req.body.available_seats
        });

        const result = await new_ride.save();

        await pusher.trigger('passenger', 'createRide', {
          message: 'ride has been created',
        });
        console.log('trigger for created ride has occured');

        res.status(201).json({
          message: 'ride created'
        });



      }
    } else {

      res.status(401).json({
        message: 'driver does not exist'
      });

    }
  } catch(err) {

    res.status(500).json({
      err
    });

  }
}

exports.delete_create_ride = async (req, res) => {
  try {

    const driver = await Driver.find({driver_id: req.body.driver_id});
    const ride = await CreateRide.find({create_ride_id: req.body.create_ride_id});

    if(driver[0].driver_id == ride[0].driver_id) {
      await CreateRide.remove({create_ride_id: req.body.create_ride_id});

      await pusher.trigger('passenger', 'createRide', {
        message: 'created ride has been deleted',
      });
      console.log('trigger for deletion of created ride has occured');

      res.status(200).json({
        message: 'created ride has been deleted successfully'
      });

    } else {
      res.status(401).json({
        message: 'driver does not have access to this ride'
      });

    }

  } catch(err) {

    res.status(500).json({
      err,
      message: 'something went wrong',
    });

  }
}

exports.get_created_ride_driver = async (req, res) => {
  try {

    const ride = await CreateRide.find({driver_id: req.params.id});
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

    const ride = await RequestRide.find({request_ride_id: req.body.request_ride_id});

    if(ride.length > 0) {

      const driver = await Driver.find({driver_id: req.body.driver_id});
      const passenger = await Passenger.find({passenger_id: ride[0].passenger_id});
      
      if(driver.length > 0 && passenger.length > 0) {
      
        const accept_ride = await AcceptRide.find({driver_id: req.body.driver_id});

        if(accept_ride.length > 0) {

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
  
          const driver_ride = await CreateRide.find({driver_id: req.body.driver_id});
  
          if(driver_ride.length > 0) {
            await CreateRide.remove({driver_id: req.body.driver_id});

            await pusher.trigger('passenger', 'createRide', {
              message: 'created ride has been deleted',
            });
            console.log('trigger for deletion of created ride has occured');
          }
  
          await RequestRide.remove({request_ride_id: req.body.request_ride_id});

          await pusher.trigger('driver', 'requestedRide', {
            message: 'requested ride has been deleted'
          });
          console.log('trigger for deletion of requested ride has occured');
          
          const eventname1 = 'acceptRide'+ride[0].passenger_id;

          await pusher.trigger('passenger', eventname1.toString(), {
            message: 'your ride has been accepted',
          });
          console.log('trigger for accepted ride to the passenger has occured');

          const eventname2 = 'acceptRide'+req.body.driver_id;

          await pusher.trigger('driver', eventname2.toString(), {
            message: 'your ride has been accepted',
          });
          console.log('trigger for accepted ride to the passenger has occured');
          
          const result = await new_ride.save();

          res.status(201).json({
            message: 'ride accepted'
          });

        }
        
      } else {

        res.status(404).json({
          message: 'driver not found'
        });
      }
    } else {

      res.status(404).json({
        message: 'requested ride not found'
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
    const driver = await Driver.find({driver_id: req.body.driver_id});
    const ride = await AcceptRide.find({accept_ride_id: req.body.accept_ride_id});

    if(driver[0].driver_id == ride[0].driver_id) {
      await AcceptRide.remove({accept_ride_id: req.body.accept_ride_id});

      const eventname = 'acceptRide'+ride[0].passenger_id;
      
      await pusher.trigger('passenger', eventname, {
        message: 'your accepted ride has been canceled',
      });
      console.log('trigger for the cancelation of accepted ride to the passenger has occured');

      res.status(200).json({
        message: 'accepted ride has been deleted successfully'
      });

    } else {

      res.status(401).json({
        message: 'driver does not have access to this ride'
      });

    }

  } catch(err) {

    res.status(500).json({
      err,
      message: 'something went wrong',
    });

  }
}

exports.get_accepted_ride_driver = async (req, res) => {
  try {
    const ride = await AcceptRide.find({driver_id: req.params.id});
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

exports.get_all_information_driver = async (req, res) => {
  try {
    const driver = await Driver.find({driver_id: req.params.id});
    const created_ride = await CreateRide.find({driver_id: req.params.id});
    const accepted_ride = await AcceptRide.find({driver_id: req.params.id});

    res.status(200).json({
      driver: {
        "username": driver[0].username,
        "name": driver[0].name,
        "mobile_no": driver[0].mobile_no,
        "vehicle_type": driver[0].vehicle_type,
        "license_no": driver[0].license_no,        
        "driver_id": driver[0].driver_id
      },
      created_ride: created_ride.length > 0 ? {
        "driver_id": created_ride[0].driver_id,
        "created_by": created_ride[0].created_by,
        "source": created_ride[0].source,
        "destination": created_ride[0].destination,
        "timing": created_ride[0].timing,
        "fare": created_ride[0].fare,
        "availabe_seats": created_ride[0].availabe_seats,
        "create_ride_id": created_ride[0].create_ride_id
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
