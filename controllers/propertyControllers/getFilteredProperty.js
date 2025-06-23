const Property = require("../../modals/PropertyModals/BasePropertySchema");
const { getPropertyPrice } = require("../../utils");

const getFilteredProperty = async (req, res) => {
  try {
    console.log("Query params:", req.query);
    const {
      propertyType,
      category,
      minPrice,
      maxPrice,
    } = req.query;

    let filter = { propertyStatus: "Active" };
    if (propertyType) filter.propertyType = propertyType;
    if (category) filter.category = category;

    console.log("Filter:", filter);

    const propertyData = await Property.find(filter)
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name email" },
      })
      .lean();

    console.log("Found properties:", propertyData.length);

    // No CloudFront logic, use images as is
    const modifiedProperties = propertyData.map((property) => {
      return {
        ...property,
        images: property.images || [],
      }
    });

    let filteredProperties = modifiedProperties;
    
    // Apply price filtering if minPrice and maxPrice are provided
    if (minPrice || maxPrice) {
      const minPriceValue = parseFloat(minPrice) || 0;
      const maxPriceValue = parseFloat(maxPrice) || Infinity;
      
      console.log("Price range:", { minPriceValue, maxPriceValue });
      
      filteredProperties = modifiedProperties.filter((property) => {
        const price = property.pricing?.price?.amount || 
                     property.pricing?.expectedPrice || 
                     property.pricing?.monthlyRent || 
                     property.price || 0;
        const numericPrice = parseFloat(price);
        console.log("Property price:", { id: property._id, price: numericPrice });
        return !isNaN(numericPrice) && 
               numericPrice >= minPriceValue && 
               numericPrice <= maxPriceValue;
      });
    }

    console.log("Filtered properties:", filteredProperties.length);

    res.status(200).json({ 
      success: true, 
      properties: filteredProperties,
      total: filteredProperties.length 
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = getFilteredProperty;
