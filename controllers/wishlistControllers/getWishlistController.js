const User = require("../../modals/Users");
const Wishlist = require("../../modals/Wishlist");
const basePropertySchema = require("../../modals/PropertyModals/BasePropertySchema");

const getWishlists = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wishlists = await Wishlist.find({ user: userId })
      .populate({
        path: "properties",
        select: "_id category propertyType role location type pricing images rating createdAt",
        populate: {
          path: "reviews",
          select: "rating comment",
          populate: {
            path: "user",
            select: "name email",
          },
        },
      })
      .lean();

    if (!wishlists || wishlists.length === 0) {
      return res.status(404).json({ error: "No wishlists found for this user" });
    }

    const properties = wishlists.flatMap((wishlist) => wishlist.properties);

    const cloudfrontBaseUrl = process.env.CLOUDFRONT_BASE_URL;
    const s3Base = process.env.S3_BASE_URL;

    const modifiedProperties = properties.map((property) => {
      const modifiedImages = property.images?.map((image) => {
        const relativePath = image.url.replace(s3Base, "");
        return {
          ...image,
          url: `${cloudfrontBaseUrl}${relativePath}`,
        };
      }) || [];

      return {
        _id: property._id,
        location: property.location,
        category:property.category,
        role:property.role,
        propertyType: property.propertyType,
        pricing: property.pricing,
        images: modifiedImages,
        rating: property.rating || 4.5,
        createdAt: property.createdAt,
      };
    });

    res.status(200).json({
      message: "Wishlists retrieved successfully",
      wishlistsData: modifiedProperties,
    });
  } catch (error) {
    console.error("Error retrieving wishlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const removeFromWishlist = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user.userId; 
  try {

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    
    if (!wishlist.properties.includes(propertyId)) {
      return res.status(400).json({ error: "Property not found in wishlist" });
    }

   
    await Wishlist.updateOne(
      { user: userId },
      { $pull: { properties: propertyId } }
    );

    
    const updatedWishlist = await Wishlist.findOne({ user: userId });
    if (updatedWishlist.properties.length === 0) {
      await Wishlist.deleteOne({ user: userId });
      await User.updateOne(
        { _id: userId },
        { $pull: { wishlist: updatedWishlist._id } }
      );
    }

    res.status(200).json({ message: "Property removed from wishlist" });
  } catch (error) {
    console.error("Error removing property from wishlist:", error);
    res.status(500).json({ error: "Failed to remove property" });
  }
};
module.exports = { getWishlists, removeFromWishlist };