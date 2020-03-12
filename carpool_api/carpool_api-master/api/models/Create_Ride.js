const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const createRideSchema = mongoose.Schema({
  driver_id: {
    type: Number,
    required: true
  },
  created_by: {
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
  available_seats: {
    type: Number,
    required: true
  },
  create_at: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {expires: '9h'},
  },
});

createRideSchema.plugin(AutoIncrement, {inc_field: 'create_ride_id'});

module.exports = mongoose.model('CreateRide', createRideSchema);