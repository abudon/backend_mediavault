// Import required modules
const bookingModel = require('../models/bookingListModel')


class BookingController {
    // Variable
    constructor() {
        this.bookingModel = new bookingModel()
    }

    // Method to create a new booking
    async create(req, res)
    {
        try {
            const { userId, bookingData } = req.body;
            // Clean booking data
            // Will come back to check on this
            const booking_data = {...bookingData, user_id:userId}
            const newBooking = await this.bookingModel.create(booking_data);
            res.status(201).json(newBooking);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create booking' });
        }
    }

    // Method to fetch all bookings for specific user
    async read(req, res)
    {
        try {
            const userId = req.params.userId;
            const bookings = await this.bookingModel.find(userId);
            res.status(200).json({ bookings });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch bookings' });
        }
    }

    // Method to fetch all bookings
    async readAll(req, res)
    {
        try {
            const bookings = await this.bookingModel.findAll();
            res.status(200).json({ bookings });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch all bookings' });
        }
    }

    // Method to update a booking
    async update(req, res)
    {
        try {
            const bookingId = req.params.id;
            const { booking_status } = req.body;
            const updatedBooking = await this.bookingModel.update(bookingId, booking_status);
            res.status(200).json(updatedBooking);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to update booking' });
        }
    }
}

module.exports = BookingController;
