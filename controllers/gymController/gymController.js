const Gym = require("../../modals/Gym");
const User = require("../../modals/Users");

const createGym = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const {
    gymType,
    city,
    state,
    locality,
    subLocality,
    apartment,
    gymName,
    gymDescription,
    images,
    video,
    capacity,
    equipmentType,
    membershipType,
    amenitites,
    availableStatus,
    availableFrom,
    ageOfGym,
    gymEquipment,
    facilities,
    trainerServices,
    bookingDetails,
    rules,
    additionalFeatures,
    pricing
  } = req.body;

  if (!gymType || !city || !state || !gymName || !gymDescription || !capacity || 
      !equipmentType || !membershipType || !amenitites || !availableStatus) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    const gym = new Gym({
      userId,
      gymType,
      city,
      state,
      locality,
      subLocality,
      apartment,
      gymName,
      gymDescription,
      images,
      video,
      capacity,
      equipmentType,
      membershipType,
      amenitites,
      availableStatus,
      availableFrom,
      ageOfGym,
      gymEquipment,
      facilities,
      trainerServices,
      bookingDetails,
      rules,
      additionalFeatures,
      pricing
    });
    
    await User.findByIdAndUpdate(
      userId,
      { $push: { gyms: gym._id } },
      { new: true }
    );
    await gym.save();


    res.status(201).json({ message: "Gym created successfully", gym });
  } catch (error) {
    res.status(500).json({ error: "Failed to create gym" });
  }
};

const updateGym = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const gymId = req.params.id;
  if (!gymId) {
    return res.status(400).json({ error: "Gym ID is required" });
  }

  const updateData = req.body;
  if (!updateData) {
    return res.status(400).json({ error: "Update data is required" });
  }

  try {
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }
    if (gym.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this gym" });
    }

    Object.assign(gym, updateData);
    await gym.save();

    res.status(200).json({ message: "Gym updated successfully", gym });
  } catch (error) {
    res.status(500).json({ error: "Failed to update gym" });
  }
};

const deleteGym = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const gymId = req.params.id;
  if (!gymId) {
    return res.status(400).json({ error: "Gym ID is required" });
  }

  try {
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }
    if (gym.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this gym" });
    }
    await gym.deleteOne();
    await User.findByIdAndUpdate(userId, { $pull: { gyms: gymId } });

    res.status(200).json({ message: "Gym deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete gym" });
  }
};

const getGymById = async (req, res) => {
  const gymId = req.params.id;
  if (!gymId) {
    return res.status(400).json({ error: "Gym ID is required" });
  }
  try {
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }
    res.status(200).json({ gym });
  } catch (error) {
    res.status(500).json({ error: "Failed to get gym" });
  }
};

const getGyms = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { city, state, gymType, availableStatus } = req.query;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: "Page and limit must be positive integers" });
  }

  const skip = (page - 1) * limit;
  const query = {};

  if (city) query.city = city;
  if (state) query.state = state;
  if (gymType) query.gymType = gymType;
  if (availableStatus) query.availableStatus = availableStatus;

  try {
    const total = await Gym.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const gyms = await Gym.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      gyms, 
      totalPages, 
      hasNextPage, 
      hasPrevPage,
      total
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get gyms" });
  }
};

const getGymsByUserId = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const gyms = await Gym.find({ userId: userId });
    res.status(200).json({ gyms });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gyms" });
  }
};

const searchGyms = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const gyms = await Gym.find({
      $or: [
        { gymName: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { state: { $regex: query, $options: 'i' } },
        { locality: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json({ gyms });
  } catch (error) {
    res.status(500).json({ error: "Failed to search gyms" });
  }
};

module.exports = {
  createGym,
  updateGym,
  deleteGym,
  getGymById,
  getGyms,
  getGymsByUserId,
  searchGyms
};
