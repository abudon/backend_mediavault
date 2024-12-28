// Import Sequelize and the connection instance
const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const User = require('./create_users_table');

// Define the BookingList model
const BookingList = sequelize.define('booking_list', {
    // Define attributes of the booking list
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    home_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    booking_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    session_type: {
        type: DataTypes.STRING
    },
    specific_requirements: {
        type: DataTypes.TEXT
    },

    booking_status: {
        type: DataTypes.ENUM('confirmed', 'pending', 'canceled'),
        defaultValue: "pending",
        allowNull: false


    },
    payment_status: {
        type: DataTypes.ENUM('paid', 'pending'),
        defaultValue: "pending",
        allowNull: false
    },
    additional_notes: {
        type: DataTypes.TEXT
    },
    // New attributes
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    // Define additional options
    tableName: 'booking_lists', // Set the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    createdAt: 'created_at', // Customize the name of the createdAt column
    updatedAt: 'updated_at' // Customize the name of the updatedAt column
});

// Define associations
BookingList.belongsTo(User, { foreignKey: 'user_id' }); // Associate each booking list with a user



module.exports = BookingList;