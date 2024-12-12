
const express = require('express')


const router = express.Router();

// Middleware function to handle GET request to /api/users

router.get('/', (req, res) => {
    res.send('Get all users'); // Example response
});

// Middleware function to handle POST request to /api/users
router.post('/', (req, res) => {
    res.send('Create new user'); // Example response
});

// Middleware function to handle GET request to /api/users/:id
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Get user with ID ${userId}`); // Example response
});

// Middleware function to handle PUT request to /api/users/:id
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Update user with ID ${userId}`); // Example response
});

// Middleware function to handle DELETE request to /api/users/:id
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Delete user with ID ${userId}`); // Example response
});

module.exports = router;