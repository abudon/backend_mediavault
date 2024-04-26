// Import Sequelize and the connection instance
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./usersModel');

// Define the BookingList model
const Notifications = sequelize.define('Notifications', {
    // Define attributes of the booking list
    messages: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    // Define additional options
    tableName: 'notifications', // Set the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    createdAt: 'created_at', // Customize the name of the createdAt column
    updatedAt: 'updated_at' // Customize the name of the updatedAt column
});

// Define associations
Notifications.belongsTo(User, { foreignKey: 'user_id' }); // Associate each notification with a user

// Sync the model with the database


module.exports = Notifications;
