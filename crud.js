const User = require('./models/usersModel.js')
const Image = require('./models/imageModel.js')
const sequelize = require('./database/connection.js')


// CREATE  USER
const createUser = async (username, email, password, role) => {
    try {
        const user = await User.create({
            username,
            email,
            password,
            role,
        });
        console.log('User created:', user.toJSON());
        return user; // Return the created user object
    } catch (e) {
        console.error('Error creating user:', e);
        return null; // Return null to indicate an error
    }
};

// READ  USER

const getUser = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.findAll();

        // If no users are found, return an appropriate response
        if (!users.length) {
            return res.status(404).json({message: 'No users found'});
        }

        // If users are found, return them as JSON
        res.status(200).json({users});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const getSpecificUser = async (email, password) => {
    try {
        // Find a user where the email and password match
        const user = await User.findOne({
            where: {
                email: email,
                password: password
            }
        });

        if (user) {
            console.log('User found:', user.toJSON());
            return user.toJSON(); // Return the user object if found
        } else {
            console.log('User not found');
            return null; // Return null if no user found
        }
    } catch (e) {
        console.error('Error fetching user:', e);
        throw e; // Throw the error for handling at a higher level
    }
}

// UPDATE USERS
async function updateUser(userId, updates) {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            await user.update(updates);
            console.log('User updated successfully.');
        } else {
            console.error('User not found.');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

// REMOVE USER

async function deleteUser(userId) {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            await user.destroy();
            console.log('User deleted successfully.');
        } else {
            console.error('User not found.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

module.exports = {
    createUser, getUser, updateUser,deleteUser, getSpecificUser
}

