const sequelize = require('../database/connection.js');
const {DataTypes} = require('sequelize');
const User = require('./usersModel.js')

const Image = sequelize.define('Image',{
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
Image.sync().then(
    ()=>console.log("table created successfully")
).catch(e=>console.error(e))
module.exports = Image