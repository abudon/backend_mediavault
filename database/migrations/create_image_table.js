const sequelize = require('../connection');
const {DataTypes} = require('sequelize');
const User = require('./create_users_table')

const Image = sequelize.define('image',{
    image_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    tableName: 'images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})
Image.belongsTo(User,{foreignKey:'user_id'})

module.exports = Image