// Import required Models
const User = require('../models/usersModel');
const validate = require('../validator/validate');
class UsersController{
    // Constructor
    constructor() {
        this.users_model = new User();
    }

    // Variables

    // Method to get all users
    async create(req, res){
        // Implement logic to create a new user
        const usersData = req.body;
        const errors = [];
        try {
            // Validate username
            if (!usersData.username || !validate.validate_username.test(usersData.username))
            {
                errors.push('Username must contain only letters and numbers');
            }
            // Validate email
            if (!usersData.email ||!validate.validate_email.test(usersData.email))
            {
                errors.push('Invalid email format');
            }
            // Validate password
            if (!usersData.password ||!validate.validate_password.test(usersData.password))
            {
                errors.push('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character');
            }
            // If errors exist, send them back with status code 400
            if (errors.length > 0) {
                return res.status(400).json({errors});
            }
            // If no errors, proceed with creating the user
            // Implement logic to create the user in the database
            const user =  this.users_model.create(usersData);
            // Return success message with the created user details
            res.status(201).json(
                {
                    message: "user created successfully",
                    user: user
                }
            )

        }catch (e){
            console.error(e);
            return res.status(500).json({ error: 'Internal server error' });
        }

    }

    // Method to get specific user
    async get(req, res)
    {
        try {
            const {email, password} = req.body;
            const user = await this.users_model.find(email, password)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        }catch (e) {
            // Handle any errors that occur during the process
            console.error('Error authenticating user:', e);
            res.status(500).json({ error: 'Internal server error' });
        }

    }
    // Method to get all users
    async getAll(req, res){
        try {
            const users = await this.users_model.all();
            res.status(200).json(users);
        }catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    // Get User by Id
    async getById(req, res)
    {
        try {
            const {user_id} = req.body
            const user = await this.users_model.findById(user_id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (e) {
            // Handle any errors that occur during the process
            console.error('Error fetching user:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Method to update specific user
    async update(req, res)
    {
        try {
            const user_id = req.params.user_id;
            const updatedUserData = req.body;
            const user = await this.users_model.update(user_id, updatedUserData);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (e) {
            // Handle any errors that occur during the process
            console.error('Error updating user:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Method to delete specific user
    async delete(req, res)
    {
        try {
            const user_id = req.params.user_id;
            const user = await this.users_model.destroy(user_id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (e) {
            // Handle any errors that occur during the process
            console.error('Error deleting user:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = UsersController;