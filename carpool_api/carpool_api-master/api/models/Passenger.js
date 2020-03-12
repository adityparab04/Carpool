const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const passengerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobile_no: {
    type: String,
    required: true
  }
});

passengerSchema.plugin(AutoIncrement, {inc_field: 'passenger_id'});

module.exports = mongoose.model('Passenger', passengerSchema);