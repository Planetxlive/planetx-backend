const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Roommate Wanted", "Property For Sale", "Property For Rent", "Community Updates", "Market Insights"],
    required: true,
  },
   description: {
    type: String,
    required: true,
   },
   image: {
    type: String,
   }, 
   contactInfo: {
    type: String,
    required: true,
   },
   createdAt: {
    type: Date,
    default: Date.now,
   },
   updatedAt: {
    type: Date,
    default: Date.now,
   },
   isApproved: {
    type: Boolean,
    default: true,
   }
});

module.exports = mongoose.model("Blog", blogSchema);