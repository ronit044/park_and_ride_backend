const MetroStation = require("../models/parkingData");
const ParkingBooking = require("../models/parkingBooking");
const { NotFoundError, InternalServerError } = require("../errors");

const getParkingData = async (metroStationId) => {
  if (!metroStationId) {
    throw new Error("metroStationId is required");
  }
  try {
    const station = await MetroStation.findOne({ metroStationId });
    if (!station) {
      console.log("nottt!!")
      throw new NotFoundError("Metro Station not found!");
    }
    return station;
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const bookSpot = async (bookingDetails) => {
  const {
    userId,
    metroStationId,
    parkingAreaId,
    parkingSpotId,
    bookingType,
    startTime,
    endTime,
    amount,
  } = bookingDetails;
console.log(bookingDetails);
  // Validate required fields
  if (
    !userId ||
    !metroStationId ||
    !parkingAreaId ||
    !parkingSpotId ||
    !bookingType ||
    !startTime ||
    !endTime ||
    !amount
  ) {
    throw new Error("Missing booking details");
  }

  try {
    const station = await MetroStation.findOne({ metroStationId });
    if (!station) throw new NotFoundError("Metro station not found");

    const parkingArea = station.parkingAreas.find(
      (pa) => pa.areaId === parkingAreaId
    );
    if (!parkingArea) throw new NotFoundError("Parking area not found");

    const slot = parkingArea.slots.find((s) => s.slotId === parkingSpotId);
    if (!slot) throw new NotFoundError("Parking slot not found");
    if (slot.reserved) throw new Error("Parking slot is already reserved");

    slot.reserved = true;
    await station.save();

    // Set expiry time based on bookingType:
    // - hourly: 1 hour
    // - daily: 24 hours
    // - monthly: 28 days
    const startDate = new Date(startTime);
    let expiryTime;
    switch (bookingType) {
      case "hourly":
        expiryTime = new Date(startDate.getTime() + 1 * 60 * 60 * 1000); // 1 hour
        break;
      case "daily":
        expiryTime = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        break;
      case "monthly":
        expiryTime = new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000); // 28 days
        break;
      default:
        expiryTime = new Date(startDate.getTime() + 1 * 60 * 60 * 1000);
    }

    const newBooking = new ParkingBooking({
      userId,
      metroStationId,
      parkingAreaId,
      parkingSpotId,
      bookingType,
      startTime: startDate,
      endTime: new Date(endTime),
      amount,
      expiryTime,
      status: "booked",
    });
    await newBooking.save();

    return newBooking;
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};



const getUserBookings = async (req, res) => {
  try {
    const userId = req.body.userId;

    const bookings = await ParkingBooking.find({ userId }).sort({ createdAt: -1 });

    if (!bookings.length) {
      throw new NotFoundError("No bookings found for this user");
    }

    res.status(200).json({
      message: "User bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

module.exports = { getParkingData, bookSpot, getUserBookings };
