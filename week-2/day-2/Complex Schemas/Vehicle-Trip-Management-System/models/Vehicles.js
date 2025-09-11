const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  startLocation: {
    type: String,
    required: [true, 'startLocation is required']
  },
  endLocation: {
    type: String,
    required: [true, 'endLocation is required']
  },
  distance: {
    type: Number,
    required: [true, 'distance is required'],
    min: [0.0000001, 'distance must be greater than 0']
  },
  startTime: {
    type: Date,
    required: [true, 'startTime is required']
  },
  endTime: {
    type: Date,
    required: [true, 'endTime is required'],
    validate: {
      validator: function(value) {
        return !this.startTime || value >= this.startTime;
      },
      message: 'endTime must be equal or after startTime'
    }
  }
}, { _id: true });

const VehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'registrationNumber is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['car', 'truck', 'bike'],
      message: '{VALUE} is not a valid vehicle type'
    },
    required: [true, 'type is required']
  },
  model: {
    type: String,
    required: [true, 'model is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  trips: [TripSchema]
}, { timestamps: true });

VehicleSchema.methods.totalDistance = function() {
  return this.trips.reduce((sum, t) => sum + (t.distance || 0), 0);
};

const Vehicle = mongoose.model('Vehicle', VehicleSchema);
module.exports = Vehicle;
