
// IMPORT ALL REQUIRED MODULES
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./database/connection.js')
const userRoutes = require('./routes/userRoutes.js')
const User = require('./models/usersModel.js')
const Image = require('./models/imageModel.js')
const BookingList = require('./models/bookingListModel.js')
const Gallery = require('./models/galleryModel.js')
const Notifications = require('./models/notificationsModel.js')
const {  createUser, getSpecificUser } = require('./crud.js')
const {getUser} = require("./crud");
const {params, body} = require("express/lib/request");
const {status} = require("express/lib/response");
const multer = require("multer");
const {join, extname} = require("path");
const {existsSync, createReadStream} = require("fs");



// VARIABLES
const port = process.env.PORT || 3000


// CREATING EXPRESS APPLICATION

const Index = express();

// MIDDLEWARE
Index.use(bodyParser.json()); // Parse JSON requests
Index.use(cors()); // Enable CORS
Index.use(morgan('dev')); // Logging HTTP requests
Index.use(express.json());

// STORAGE SET UP
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

// Initialize multer middleware
const upload = multer({ storage: storage });

// ROUTE


// CREATE NOTIFICATIONS FOR USERS
Index.post('/notifications', async (req, res) => {
    try {
        const { userId, message } = req.body; // Get the user ID and notification data from the request body

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Create a new notification associated with the user
        const notification = await Notifications.create({ messages: message, user_id: userId });

        res.status(201).json(notification); // Return the created notification
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'An error occurred while creating the notification.' });
    }
});


//READ NOTIFICATIONS FOR USERS

Index.get('/notifications/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Get the user ID from the request parameters

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Retrieve all notifications associated with the user from the database
        const notifications = await Notifications.findAll({ where: { user_id: userId } });

        res.json(notifications); // Return the notifications
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the notifications.' });
    }
});






// INSERT DATA TO THE BOOKING LIST



Index.post('/booking-list', async (req, res) => {
    try {
        // Extract booking data from the request body
        const { userId, bookingData } = req.body;

        // Create a new booking list object with the provided data
        const newBooking = new BookingList({
            user_id: userId,
            customer_name: bookingData.customer_name,
            email: bookingData.email,
            home_address: bookingData.home_address,
            phone_number: bookingData.phone_number,
            booking_datetime: bookingData.booking_datetime,
            session_type: bookingData.session_type,
            specific_requirements: bookingData.specific_requirements,
            additional_note: bookingData.additional_note,
            start_time: bookingData.start_time,
            end_time: bookingData.end_time

        });

        // Save the new booking list object to the database
        await newBooking.save();

        // Return a success response
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Endpoint to get the booking list for a specific user
Index.get('/booking-list/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Query the database to fetch the booking list for the specified user
        const bookingList = await BookingList.findAll({where: {user_id: userId}});

        // Return the fetched booking list as a JSON response
        res.status(200).json({ bookingList });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error fetching booking list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// GET BOOKING LIST FROM TABLE

Index.get('/booking-list',async (req, res) => {
    try {
        // Query the database to fetch all booking lists
        const bookingLists = await BookingList.findAll({

            include: {
                model: User, // Include the User model
                attributes: ['username'], // Include only the username attribute from the User model
                as: 'user' // Alias for the joined user data
            }
        });

        // Return the fetched booking lists as a JSON response
        res.status(200).json({ bookingLists });
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error fetching booking lists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// UPDATING BY BOOKING ID
Index.put('/booking-list/:id', async (req, res) => {
    const bookingId = req.params.id;
    const { booking_status } = req.body; // Assuming you want to update the booking status

    try {
        // Find the booking list item by its ID
        const bookingItem = await BookingList.findByPk(bookingId);

        if (!bookingItem) {
            return res.status(404).json({ error: 'Booking list item not found' });
        }

        // Update the booking status
        bookingItem.booking_status = booking_status;

        // Save the updated booking list item to the database
        await bookingItem.save();

        // Return the updated booking list item as a JSON response
        res.status(200).json({ message: 'Booking list item updated successfully', bookingItem });
    } catch (error) {
        // Handle any errors that occur during the update process
        console.error('Error updating booking list item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// ENDPOINT TO DOWNLOAD IMAGES ASSOCIATED WITH A USER ID

Index.get('/download/:user_id', async (req, res) =>{
    try {
        // Extract user ID from request parameters
        const { user_id } = req.params;

        // Find all images associated with the provided user ID
        const images = await Image.findAll({ where: { user_id: user_id } });

        if (!images || images.length === 0) {
            return res.status(404).json({error: 'No images found for the specified user ID'})
        }

        // Generate download links for each image
        const downloadLinks = images.map(image => {
            return {
                id: image.id,
                downloadLink: `/api/images/download/${user_id}/${image.id}`,
                fileName: image.image_name // Optional: Include file name for each image
            };
        });

        res.json(downloadLinks)

    }catch (e) {
        console.error('Error downloading images:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// ENDPOINT TO DOWNLOAD A SPECIFIC IMAGE ASSOCIATED WITH A USER ID
Index.get('/api/images/download/:user_id/:image_id', async (req, res) => {
    try {
        // Extract user ID and image ID from request parameters
        const { user_id, image_id } = req.params;

        // Find the image associated with the provided user ID and image ID
        const image = await Image.findOne({ where: { id: image_id, user_id: user_id } });

        if (!image){
            return res.status(404).json({ error: 'Image not found for the specified user ID' })
        }

        // Get the file path of the image
        const filePath = image.file_path;
        //check if the file path is there
        if (!existsSync(filePath)){
            return res.status(404).json({error: 'Image file not found'})
        }

        // Determine the content type based on the file extension
        const contentType = getContentType(filePath);

        // Set the Content-Type header
        res.setHeader('Content-Type', contentType);

        // Stream the file for download
        const fileStream = createReadStream(filePath)
        fileStream.pipe(res)

    }catch (e) {
        console.error('Error downloading image:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Function to determine the content type based on file extension
const getContentType = (filePath) => {
    const ext = extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.mp4':
            return 'video/mp4';
        // Add more cases for other image and video file types if needed
        default:
            return 'application/octet-stream'; // Default to binary data if file type is not recognized
    }
};






// Handle POST request for file upload
Index.post('/upload/:user_id', upload.single('file'), async (req, res) => {
    try {
        const userId = req.params.user_id;
        const filePath = join(__dirname, 'uploads', req.file.filename); // Get the file path of the uploaded file

        if (!req.file) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        const imagePath = req.file.path;
        const imageName = req.file.originalname;
        const newImage = await Image.create({
            image_name: imageName,
            file_path: imagePath,
            user_id: userId
        });
        res.status(200).json({ message: 'File uploaded successfully', image: newImage });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// GET IMAGE BY ID
Index.get('/images/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        const images = await Image.findAll({ where: { user_id: userId } });

        if (!images || images.length === 0) {
            return res.status(404).json({ error: 'No images found for the user' });
        }

        res.status(200).json({ images });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETING INDIVIDUAL IMAGES
Index.delete('/images/:imageId', async (req, res) => {
    try {
        // Extract the image ID from the request parameters
        const imageId = req.params.imageId;

        // Find the image by its ID and delete it from the database
        await Image.destroy({
            where: {
                id: imageId
            }
        });

        // Send a success response
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// POST ENDPOINT FOR UPLOADING MULTIPLE FILES TO THE GALLERY
Index.post('/gallery/upload', upload.array('files'), async (req, res) => {
    try {
        const files = req.files; // Array of uploaded files

        if (!files || files.length === 0) {
            return res.status(400).json({error: 'No files uploaded'})
        }

        // Iterate through each uploaded file and save it to the gallery
        const galleryItems = [];
        for (const file of files) {
            const imagePath = file.path;
            const imageName = file.originalname;

            // Create a new gallery item for each uploaded file
            const newGalleryItem = await Gallery.create({
                image_name: imageName,
                file_path: imagePath,
            });

            galleryItems.push(newGalleryItem);
        }
        res.status(200).json({ message: 'Files uploaded successfully', galleryItems });

    }catch (e) {
        console.error('Error uploading files:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// GET REQUEST FOR ALL GALLERY IMAGE
Index.get('/gallery', async (req, res) => {
    try {
        // Fetch all gallery items from the database
        const galleryItems = await Gallery.findAll();

        // Check if any gallery items were found
        if (!galleryItems || galleryItems.length === 0) {
            return res.status(404).json({ error: 'No gallery items found' });
        }

        // If gallery items were found, send them in the response
        res.status(200).json({ message: 'Gallery items fetched successfully', galleryItems });
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



Index.get('/gallery/:id', async (req, res) => {
    try {
        // Extract user ID and image ID from request parameters
        const { id } = req.params;

        // Find the image associated with the provided user ID and image ID
        const image = await Gallery.findOne({ where: { id: id } });

        if (!image){
            return res.status(404).json({ error: 'Image not found for the specified user ID' })
        }

        // Get the file path of the image
        const filePath = image.file_path;
        //check if the file path is there
        if (!existsSync(filePath)){
            return res.status(404).json({error: 'Image file not found'})
        }

        // Determine the content type based on the file extension
        const contentType = getContentType(filePath);

        // Set the Content-Type header
        res.setHeader('Content-Type', contentType);

        // Stream the file for download
        const fileStream = createReadStream(filePath)
        fileStream.pipe(res)

    }catch (e) {
        console.error('Error downloading image:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})









Index.post('/signup', async (req, res)=>{
    try {
        const {username, email, password, role} = req.body;
        console.log(req.body)
        const newUser = createUser(username,email,password,role)
        // SEND A SUCCESSFUL RESPONSE
        res.status(201).json({message: "user created successfully", user: newUser})
    }catch (e) {
        console.error('Error creating user:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
})

Index.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch the user from the database using the provided email and password
        const user = await getSpecificUser(email, password);

        if (!user) {
            // If no user is found with the provided credentials, send a response indicating authentication failure
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If a user is found, you can proceed with any additional authentication logic here

        // Send a successful response with the authenticated user details
        res.status(200).json({ message: "User authenticated successfully", user });
    } catch (e) {
        // Handle any errors that occur during the process
        console.error('Error authenticating user:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Define the route to fetch users
Index.get('/users', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.findAll();

        // If no users are found, return an appropriate response
        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }

        // If users are found, return them as JSON
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

Index.post('/getuser',async (req, res) => {
    try {
        const {user_id} = req.body
        const user = await User.findByPk(user_id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If user found, send it in the response
        res.json(user);
    } catch (e) {
        console.error('Error fetching user:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
})

Index.put('/users/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    const updatedUserData =req.body

    try {
        const user = await User.findByPk(user_id)
        if (user){
            await user.update(updatedUserData)
            res.status(200).json({ message: 'User updated successfully' });
        }else {
            res.status(404).json({ message: 'User not found' });
        }
    }catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

// REMOVING USER FROM DATABASE
Index.delete('/users/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;

        // Delete the user from the database
        await User.destroy({
            where: {
                id: userId
            }
        });

        // Respond with success message
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ERROR HANDLING MIDDLEWARE
Index.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send("Something went Wrong")
})

// START DATABASE

async function syncModels(){
    try {

        await User.sync()
        await Image.sync()
        await Gallery.sync()
        await BookingList.sync()
        await Notifications.sync()
        console.log("The Synchronization of All Table or  Models to the DataBase is Successful")

    } catch (e) {
        console.error("Error in Synchronizing of Models with Database", e)

    }
}

// START THE SERVER

async function startServer() {
    await syncModels();
    Index.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().then(()=>console.log('successfully started')).catch(e=>console.error(e));
