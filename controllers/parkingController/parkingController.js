const Parking = require("../../models/ParkingSpot");
const User = require("../../models/User"); // Only if you're linking parkings to a user

// Create a new parking
const createParking = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const {
    spotNumber,
    location,
    type,
    isAvailable,
    hourlyRate,
    size,
    amenities,
    images,
    accessibility,
    coordinates,
  } = req.body;

  if (!spotNumber || !location || hourlyRate === undefined) {
    return res.status(400).json({ error: "spotNumber, location, and hourlyRate are required" });
  }

  try {
    const parking = new Parking({
      userId,
      spotNumber,
      location,
      type,
      isAvailable,
      hourlyRate,
      size,
      amenities,
      images,
      accessibility,
      coordinates,
    });

    await parking.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { parkings: parking._id } },
      { new: true }
    );

    res.status(201).json({ message: "Parking created successfully", parking });
  } catch (error) {
    res.status(500).json({ error: "Failed to create parking" });
  }
};

// Update parking
const updateParking = async (req, res) => {
  const userId = req.user.userId;
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
    res.status(500).json({ error: "Failed to update parking" });
  }
};

// Delete parking
const deleteParking = async (req, res) => {
  const userId = req.user.userId;
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
    res.status(500).json({ error: "Failed to delete parking" });
  }
};

// Get parking by ID
const getParkingById = async (req, res) => {
  const parkingId = req.params.id;

  if (!parkingId) {
    return res.status(400).json({ error: "Parking ID is required" });
  }

  try {
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({ error: "Parking not found" });
    }

    res.status(200).json({ parking });
  } catch (error) {
    res.status(500).json({ error: "Failed to get parking" });
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
    const parkings = await Parking.find().skip(skip).limit(limit);

    res.status(200).json({
      parkings,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get parkings" });
  }
};

// Get parkings by user ID
const getParkingsByUserId = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const parkings = await Parking.find({ userId });
    res.status(200).json({ parkings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch parkings" });
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
