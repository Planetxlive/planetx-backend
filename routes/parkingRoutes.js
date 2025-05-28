const express = require("express");
const parkingRouter = express.Router();

const {
  createParking,
  updateParking,
  deleteParking,
  getParkingById,
  getParkings,
  getParkingsByUserId
} = require("../controllers/parkingController/parkingController");


parkingRouter.get("/", getParkings);

parkingRouter.post("/create",createParking);
parkingRouter.put("/update/:id",updateParking);
parkingRouter.delete("/delete/:id",deleteParking);
parkingRouter.get("/user",getParkingsByUserId);
parkingRouter.get("/:id", getParkingById);




module.exports =parkingRouter;
