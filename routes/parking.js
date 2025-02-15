const express = require("express");

const router = express.Router();
const auth=require("../middleware/authentication")

const { bookSpotController,getParkingDataController} = require("../controllers/parkingController");
const {getUserBookings}=require("../service/ParkingService")

router.get("/parking", getParkingDataController);
router.post("/parking/book",auth, bookSpotController);
router.get("/user-bookings", auth, getUserBookings);

module.exports = router;
