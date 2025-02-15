const mongoose = require('mongoose');

const parkingBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metroStationId: { type: String, required: true },
  parkingAreaId: { type: String, required: true },
  parkingSpotId: { type: String, required: true }, // Unique ID for parking slot
  bookingType: { type: String, enum: ['hourly', 'daily', 'monthly'], required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['booked', 'expired', 'cancelled'], default: 'booked' },
  expiryTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParkingBooking', parkingBookingSchema);
