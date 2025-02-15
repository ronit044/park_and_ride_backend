const { StatusCodes } = require("http-status-codes");
const { bookSpot,getParkingData } = require("../service/ParkingService");

const getParkingDataController = async (req, res, next) => {
    try {
      const { metroStationId } = req.query;
      console.log(metroStationId);
      const station = await getParkingData(metroStationId);
      res.status(200).json(station);
    } catch (error) {
      next(error); 
    }
  };

  const bookSpotController = async (req, res, next) => {
    try {
      const newBooking = await bookSpot(req.body);
      res.status(201).json({ message: "Booking successful", booking: newBooking });
    } catch (error) {
      next(error);
    }
  };

  
module.exports = {
    getParkingDataController,
    bookSpotController,
};
