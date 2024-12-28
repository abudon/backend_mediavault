// Import required modules
const User = require('../database/migrations/create_users_table')

class UsersModel {
    async create(props){
     try {
         const users = await User.create(props)
         console.log('User created:', users.toJSON());
         return users
     } catch (e) {
         console.error('Error creating user:', e);
         return null; // Return null to indicate an error
     }
    }

    // Find a specific user by email and password
    async find(email, password){
        try {
            const user = await User.findOne({ where: { email, password } });
            if (user){
                console.log('User found:', user.toJSON());
                return user;
            }else {
                console.log('User not found');
                return null;
            }

        } catch (e) {
            console.error('Error finding user:', e);
            throw e; // Throw the error for handling at a higher level
        }
    }

    // get all users
    async all(){
        try {
            const users = await User.findAll();
            console.log('Users fetched:', users.map(user => user.toJSON()));
            return users;
        } catch (e) {
            console.error('Error fetching users:', e);
            throw e; // Throw the error for handling at a higher level
        }
    }

    // Find user by id
    async findById(id){
        try {
            const user = await User.findByPk(id);
            if (user){
                console.log('User found:', user.toJSON());
                return user;
            } else {
                console.log('User not found');
                return null;
            }
        } catch (e) {
            console.error('Error finding user:', e);
            throw e; // Throw the error for handling at a higher level
        }
    }

    // Update user by id
    async update(id, updates)
    {
        try {
            const user = await User.findByPk(id);
            if (user) {
                await user.update(updates);
                console.log('User updated:', user.toJSON());
                return user;
            } else {
                console.log('User not found.');
                return null;
            }
        } catch (e) {
            console.error('Error updating user:', e);
            throw e; // Throw the error for handling at a higher level
        }
    }

    // Delete user by id
    async destroy(id)
    {
        try {
            const user = await User.findByPk(id);
            if (user) {
                await user.destroy();
                console.log('User deleted:', user.toJSON());
                return true;
            } else {
                console.log('User not found.');
                return false;
            }
        } catch (e) {
            console.error('Error deleting user:', e);
            throw e; // Throw the error for handling at a higher level
        }
    }
}

module.exports=UsersModel;