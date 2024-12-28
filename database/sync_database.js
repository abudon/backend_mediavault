//Import required migrations
const User = require('./migrations/create_users_table')
const Image = require('./migrations/create_image_table')
const BookingList = require('./migrations/create_booking_table')
const Gallery = require('./migrations/create_gallery_table')

class Sync_database {
    async up() {
        try {
            await User.sync({ alter: true })
                .then(data=>"users table crated successfully").
                catch(e=>`Something went wrong with users table. ${e}`);

            await Image.sync({ alter: true })
                .then(data=>"image table crated successfully").
                catch(e=>`Something went wrong with image table. ${e}`);

            await BookingList.sync({ alter: true })
                .then(data=>"booking_list table crated successfully").
                catch(e=>`Something went wrong with booking_list table. ${e}`);

            await Gallery.sync({ alter: true })
                .then(data=>"gallery table crated successfully").
                catch(e=>`Something went wrong with gallery table. ${e}`);

            console.log("The Synchronization of All Table or  Models to the DataBase is Successful")

        } catch (e) {
            console.error("Error in Synchronizing of Models with Database", e)
        }
        // Implement code to sync the database up

    }


}

module.exports = Sync_database;