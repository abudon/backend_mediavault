///////////// IMPORTS ///////////////////
const {Sequelize} = require('sequelize');
const pg = require('pg');


///////////// VARIABLES ///////////////////

const db_name = process.env.DATABASE_NAME;
const db_user = process.env.DATABASE_USERNAME
const db_password = process.env.DATABASE_PASSWORD;
const databaseUrl = process.env.DATABASE_URL
const db_port = process.env.DATABASE_PORT

///////////// FUNCTIONS ///////////////////

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: databaseUrl,
    port: db_port,
    dialect: 'postgres',
    logging: false,
    dialectModule:pg,
    timezone:process.env.TZ,
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'  // Set collation to support emojis
    }
} )

///////////// CALLS AND LISTENERS ///////////////////
sequelize.authenticate().then(()=>(
    console.log("Connection to the Database has been established Successfully. ")
)).catch((error)=>{
    console.error('Unable to Connect to the Database', error)
})

///////////// EXPORTS ///////////////////
module.exports = sequelize;
