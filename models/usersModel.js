
const sequelize = require('../database/connection.js')
const { DataTypes } = require('sequelize')


const usersObject = {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid'),
        defaultValue: 'pending'
    }
}





const User = sequelize.define('users',usersObject,{
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User