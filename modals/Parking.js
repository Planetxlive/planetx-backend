const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  spotNumber: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['standard', 'disabled', 'electric', 'compact', 'premium'],
    default: 'standard',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium',
  },
  amenities: [{
    type: String,
    enum: ['covered', 'ev_charging', 'security_camera', 'valet'],
  }],
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(v);
      },
      message: 'Invalid image URL',
    },
  }],
  accessibility: {
    wheelchairAccessible: { type: Boolean, default: false },
    nearEntrance: { type: Boolean, default: false },
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);
