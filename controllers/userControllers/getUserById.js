const User = require("../../modals/Users");

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "User not found" });
  }
};

module.exports = { getUserById };