const mongoose = require("mongoose");
const gymSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gymType: {
    type: String,
    enum: ["Public", "Private", "Celebrity"],
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
    required: false,
  },
  subLocality: {
    type: String,
    required: false,
  },
  apartment: {
    type: String,
    required: false,
  },
  gymName: {
    type: String,
    required: true,
  },
  gymDescription: {
    type: String,
    required: true,
  },
  Rating: {
    type: Number,
    required: false,
  },
  images: [
    {
      name: { type: String, required: false },
      url: { type: String, required: false },
    },
  ],
  video: { type: String },
  capacity: {
    type: Number,
    required: true,
  },
  equipmentType: {
    type: String,
    required: true,
  },
  membershipType: {
    type: String,
    required: true,
  },
  amenitites: {
    type: Array,
    required: true,
  },
  availableStatus: {
    type: String,
    enum: ["Available", "Not Available"],
    required: true,
  },
  availableFrom: {
    type: Date,
    required: false,
  },
  ageOfGym: {
    type: Number,
    required: false,
  },
  gymEquipment: {
    type: Array,
    required: false,
  },
  facilities: {
    type: Array,
    required: false,
  },
  trainerServices: {
    type: Array,
    required: false,
  },
  bookingDetails: {
    operationHours: {
      type: String,
      required: false,
    },
    membershipOption: { type: String, required: false },
  },
  rules: {
    type: Array,
    required: false,
  },
  additionalFeatures: {
    type: Array,
    required: false,
  },
  pricing: {
    baseMembershipPrice: {
      type: Number,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
    },
    taxes: {
      type: Number,
      required: false,
    },
    finalPrice: {
      type: Number,
      required: false,
    },
  },
});

module.exports = mongoose.model("Gym", gymSchema);
