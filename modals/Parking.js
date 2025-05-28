const mongoose = require('mongoose');
require("./ParkingReview");

const parkingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
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
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  sublocality: {
    type: String,
    required: false,
  },
  areaNumber: {
    type: String,
    required: false,
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

  amenitiesDetails: {
    securityGuard: { type: Boolean, default: false },
    securityCameras: { type: Boolean, default: false },
    evCharging: { type: Boolean, default: false },
    valetService: { type: Boolean, default: false },
    coveredParking: { type: Boolean, default: false }
  },

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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for populating reviews
parkingSchema.virtual('reviews', {
  ref: 'ParkingReview',
  localField: '_id',
  foreignField: 'parkingId',
});

module.exports = mongoose.model('Parking', parkingSchema);
