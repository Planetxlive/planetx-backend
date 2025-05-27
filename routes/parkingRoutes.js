const express = require("express");
const router = express.Router();

const {
  createParking,
  updateParking,
  deleteParking,
  getParkingById,
  getParkings,
  getParkingsByUserId
} = require("../controllers/ParkingController");


router.get("/", getParkings);
router.get("/:id", getParkingById);
router.post("/create",createParking);
router.put("/update/:id",updateParking);
router.delete("/delete/:id",deleteParking);
router.get("/user",getParkingsByUserId);




module.exports =router;
