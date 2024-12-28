// Import required modules
const Booking = require('../database/migrations/create_booking_table');
const User = require('../database/migrations/create_users_table');


class BookingService {
    // Method to create a new booking
    async create(bookingData)
    {
        try {
            // Validate the booking data
            // Implement logic to create a new booking in the database
            const newBooking = await Booking.create(bookingData);
            return newBooking;
        } catch (error) {
            throw new Error(`Failed to create booking: ${error}`);
        }
    }

    // Method to fetch all bookings for specific user
    async find(id)
    {
        try {
            // Fetch all bookings for the specified user from the database
            const bookings = await Booking.findAll({ where: { user_id: id } });
            return bookings;
        }catch (e) {

        }
    }

    // Method to find all bookings
    async findAll()
    {
        try {
            // Fetch all bookings from the database
            const bookings = await Booking.findAll({
                include: {
                    model: User, // Include the User model
                    attributes: ['username'], // Include only the username attribute from the User model
                    as: 'user' // Alias for the joined user data
                }
            });
            return bookings;
        } catch (error) {
            throw new Error(`Failed to fetch all bookings: ${error}`);
        }
    }

    // Method to update a booking
    async update(id, updates)
    {
        try {
            // Fetch the booking to be updated
            const booking = await Booking.findByPk(id);
            if (!booking) {
                throw new Error('Booking not found');
            }
            // Update the booking in the database
            booking.booking_status = updates
            await booking.save()
            return booking;
        } catch (error) {
            throw new Error(`Failed to update booking: ${error}`);
        }
    }
}
module.exports = BookingService;