const {Sequelize} = require('sequelize');


const sequelize = new Sequelize('database_photoworld', 'root', '', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    logging: false
} )

sequelize.authenticate().then(()=>(
    console.log("Connection to the Database has been established Successfully. ")
)).catch((error)=>{
    console.error('Unable to Connect to the Database', error)
})

module.exports = sequelize;