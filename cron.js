const cron = require('node-cron');
const ParkingBooking = require('./models/parkingBooking');
const MetroStation = require('./models/parkingData');

cron.schedule('* * * * *', async () => {
    try {
        console.log("Cron job started");
        const now = new Date();

        // Ensure expiryTime is compared as a Date
        const expiredBookings = await ParkingBooking.find({
            expiryTime: { $lt: now },
            status: 'booked'
        });

        for (const booking of expiredBookings) {
            booking.status = 'expired';
            await booking.save(); // Wait for save

            const station = await MetroStation.findOne({ metroStationId: booking.metroStationId });
            if (station) {
                const parkingArea = station.parkingAreas.find(area => area.areaId === booking.parkingAreaId);
                if (parkingArea) {
                    const slot = parkingArea.slots.find(slot => slot.slotId === booking.parkingSpotId);
                    if (slot) {
                        slot.reserved = false;
                        await station.save(); // Save the station update
                        console.log(`Booking ${booking._id} expired. Slot ${booking.parkingSpotId} freed.`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in cron job:', error.message);
    }
});
