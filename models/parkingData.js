const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotId: String,
  reserved: { type: Boolean, default: false }
});

const parkingAreaSchema = new mongoose.Schema({
  areaId: String,
  name: String,
  rates: {
    hourly: Number,
    daily: Number,
    monthly: Number
  },
  slots: [slotSchema]
});

const metroStationSchema = new mongoose.Schema({
  metroStationId: String,
  name: String,
  parkingAreas: [parkingAreaSchema]
});

module.exports = mongoose.model('parking_spots', metroStationSchema);
