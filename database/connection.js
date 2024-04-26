const {Sequelize} = require('sequelize');


const sequelize = new Sequelize('railway', 'root', 'OKExvoHcyLaXYfIOjoPHiuagojGYHOUZ', {
    host: 'monorail.proxy.rlwy.net',
    port: '45576',
    dialect: 'mysql',
    logging: false
} )

sequelize.authenticate().then(()=>(
    console.log("Connection to the Database has been established Successfully. ")
)).catch((error)=>{
    console.error('Unable to Connect to the Database', error)
})

module.exports = sequelize;
