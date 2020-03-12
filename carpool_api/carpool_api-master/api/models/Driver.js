const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const driverSchema = mongoose.Schema({
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
  },
  vehicle_type: {
    type: String,
    required: true
  },
  license_no: {
    type: String,
    required: true
  }
});

driverSchema.plugin(AutoIncrement, {inc_field: 'driver_id'});

module.exports = mongoose.model('Driver', driverSchema);