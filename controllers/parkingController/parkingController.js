const Parking = require("../../modals/Parking");
const User = require("../../modals/Users"); // Only if you're linking parkings to a user
const ParkingReview = require('../../modals/ParkingReview'); 


// Create a new parking
const createParking = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const {
    spotNumber,
    location,
    city,
    state,
    locality,
    sublocality,
    areaNumber,
    type,
    isAvailable,
    hourlyRate,
    size,
    amenitiesDetails,
    images,
    accessibility,
    coordinates,
  } = req.body;

  // Validate required fields
  if (!spotNumber || !location || !city || !state || !locality || hourlyRate === undefined) {
    return res.status(400).json({
      error: "spotNumber, location, city, state, locality, and hourlyRate are required",
    });
  }

  try {
    const parking = new Parking({
      userId,
      spotNumber,
      location,
      city,
      state,
      locality,
      sublocality,
      areaNumber,
      type,
      isAvailable,
      hourlyRate,
      size,
      amenitiesDetails,
      images,
      accessibility,
      coordinates,
    });

    await parking.save();

    // Link parking to user (optional)
    await User.findByIdAndUpdate(
      userId,
      { $push: { parkings: parking._id } },
      { new: true }
    );

    res.status(201).json({ message: "Parking created successfully", parking });
  } catch (error) {
    console.error("CREATE PARKING ERROR:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    res.status(500).json({
      error: "Failed to create parking",
      details: error.message
    });
  }
  
};

// Update parking
const updateParking = async (req, res) => {
  const userId = req.user?.userId;
  const parkingId = req.params.id;

  if (!userId || !parkingId) {
    return res.status(400).json({ error: "User ID and Parking ID are required" });
  }

  try {
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({ error: "Parking not found" });
    }

    if (parking.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this parking" });
    }

    Object.assign(parking, req.body, { updatedAt: Date.now() });
    await parking.save();

    res.status(200).json({ message: "Parking updated successfully", parking });
  } catch (error) {
    console.error("UPDATE PARKING ERROR:", error);
    res.status(500).json({ error: "Failed to update parking", details: error.message });
  }
};

// Delete parking
const deleteParking = async (req, res) => {
  const userId = req.user?.userId;
  const parkingId = req.params.id;

  if (!userId || !parkingId) {
    return res.status(400).json({ error: "User ID and Parking ID are required" });
  }

  try {
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({ error: "Parking not found" });
    }

    if (parking.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this parking" });
    }

    await parking.deleteOne();
    await User.findByIdAndUpdate(userId, { $pull: { parkings: parkingId } });

    res.status(200).json({ message: "Parking deleted successfully" });
  } catch (error) {
    console.error("DELETE PARKING ERROR:", error);
    res.status(500).json({ error: "Failed to delete parking", details: error.message });
  }
};

// Get parking by ID
const getParkingById = async (req, res) => {
  const parkingId = req.params.id;

  if (!parkingId) {
    return res.status(400).json({ error: "Parking ID is required" });
  }

  try {
    const parking = await Parking.findById(parkingId).populate('reviews');
    if (!parking) {
      return res.status(404).json({ error: "Parking not found" });
    }

    res.status(200).json({ parking });
  } catch (error) {
    console.error("GET PARKING BY ID ERROR:", error);
    res.status(500).json({ error: "Failed to get parking", details: error.message });
  }
};

// Get all parkings with pagination
const getParkings = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: "Page and limit must be positive integers" });
  }

  const skip = (page - 1) * limit;

  try {
    const total = await Parking.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const parkings = await Parking.find()
      .skip(skip)
      .limit(limit)
      .populate('reviews');

    res.status(200).json({
      parkings,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("GET PARKINGS ERROR:", error);
    res.status(500).json({ error: "Failed to get parkings", details: error.message });
  }
};

// Get parkings by user ID
const getParkingsByUserId = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const parkings = await Parking.find({ userId }).populate('reviews');
    res.status(200).json({ parkings });
  } catch (error) {
    console.error("GET PARKINGS BY USER ERROR:", error);
    res.status(500).json({ error: "Failed to fetch parkings", details: error.message });
  }
};

module.exports = {
  createParking,
  updateParking,
  deleteParking,
  getParkingById,
  getParkings,
  getParkingsByUserId,
};
