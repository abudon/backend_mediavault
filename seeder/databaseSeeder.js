// Import required modules
const User = require('../database/migrations/create_users_table')
const {faker} = require('@faker-js/faker')

class DatabaseSeeder {

    // Method to generate fake data for users
    async generateUsers(count) {
        try {
            const users = [];
           for (let i = 0; i < count; i++) {
               users.push({
                   username : faker.internet.username(),
                   email : faker.internet.email(),
                   password : faker.internet.password(),
                   role : faker.helpers.arrayElement(["admin", 'user']),
                   paymentStatus : faker.helpers.arrayElement(['pending', 'paid'])
               })

           }
           // Insert the generated users into the database
            await User.bulkCreate(users);
            console.log(`${count} users generated and inserted into the database.`);
        }catch (e) {
            console.error('Error generating users:', e);
        }
    }
}

module.exports = DatabaseSeeder;