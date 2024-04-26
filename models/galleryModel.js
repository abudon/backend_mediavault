const sequelize = require('../database/connection.js');
const { DataTypes } = require('sequelize');

const Gallery = sequelize.define('Gallery', {
    image_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    tableName: 'gallery',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});



module.exports = Gallery;
