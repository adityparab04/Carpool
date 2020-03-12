const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const requestRideSchema = mongoose.Schema({
  passenger_id: {
    type: Number,
    required: true
  },
  requested_by: {
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
  create_at: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {expires:'9h'},
  },
});

requestRideSchema.plugin(AutoIncrement, {inc_field: 'request_ride_id'});

module.exports = mongoose.model('RequestRide', requestRideSchema);