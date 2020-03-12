const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const acceptRideSchema = mongoose.Schema({
  driver_id: {
    type: Number,
    required: true
  },
  passenger_id: {
    type: Number,
    required: true
  },
  driver_name: {
    type: String,
    required: true
  },
  passenger_name: {
    type: String,
    required: true
  },
  driver_mobile_no: {
    type: String,
    required: true
  },
  passenger_mobile_no: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  timing: {
    type: String,
    required: true
  },
  fare: {
    type: String,
    required: true
  },
  accepted_at: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {expires: '9h'},
  },
});

acceptRideSchema.plugin(AutoIncrement, {inc_field: 'accept_ride_id'});

module.exports = mongoose.model('AcceptRide', acceptRideSchema);