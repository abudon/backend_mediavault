// REQUIRED FILE FOR ENVIRONMENT VARIABLE
require('dotenv').config()
// IMPORT ALL REQUIRED MODULES
const Sync_database = require('./database/sync_database');
const UsersController = require('./controllers/usersController');
const TestController = require('./controllers/indexController');
const ImageController = require('./controllers/imageController');
const NotificationController = require('./controllers/notificationController');
const BookingController = require('./controllers/bookingController');
const GalleryController = require("./controllers/galleryController");

const DatabaseSeeder = require('./seeder/databaseSeeder')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const multer = require("multer");


// VARIABLES
const port = process.env.PORT
// CREATING EXPRESS APPLICATION
const Index = express();
const sync_database = new Sync_database();
const users_controller = new UsersController()
const test_controller = new TestController();
const image_controller = new ImageController();
const notification_controller = new NotificationController();
const booking_controller = new BookingController();
const gallery_controller = new GalleryController();
const database_seeder = new DatabaseSeeder();
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

// MIDDLEWARE
Index.use(bodyParser.json()); // Parse JSON requests
Index.use(cors()); // Enable CORS
Index.use(morgan('dev')); // Logging HTTP requests
Index.use(express.json());

// Register routes
Index.get('/', test_controller.test.bind(test_controller));

// Error-handling middleware
Index.use((err, req, res, next) => {
    test_controller.error(err, req, res, next);
});

//USER'S AUTHENTICATIONS
Index.post('/signup',users_controller.create.bind(users_controller));
Index.post('/signin',users_controller.get.bind(users_controller));
Index.post('/getuser',users_controller.getById.bind(users_controller));
Index.get('/users',users_controller.getAll.bind(users_controller));
Index.put('/users/:user_id',users_controller.update.bind(users_controller));
Index.delete('/users/:user_id',users_controller.delete.bind(users_controller));

// USER'S IMAGES
Index.post('/upload/:user_id', upload.array('files'),image_controller.create.bind(image_controller));
Index.get('/images/:user_id',image_controller.read.bind(image_controller));
Index.delete('/images/:imageId',image_controller.destroy.bind(image_controller));
Index.get('/api/images/download/:user_id/:image_id',image_controller.download.bind(image_controller));
Index.get('/download/:user_id',image_controller.downloadAll.bind(image_controller));

// USER'S NOTIFICATIONS
Index.post('/notifications',notification_controller.create.bind(notification_controller));
Index.get('/notifications/:userId',notification_controller.read.bind(notification_controller));

// USER'S BOOKING
Index.post('/booking-list',booking_controller.create.bind(booking_controller));
Index.get('/booking-list/:userId',booking_controller.read.bind(booking_controller));
Index.get('/booking-list',booking_controller.readAll.bind(booking_controller));
Index.put('/booking-list/:id',booking_controller.update.bind(booking_controller));

// GALLERY
Index.post('/gallery/upload', upload.array('files'),gallery_controller.create.bind(gallery_controller));
Index.get('/gallery',gallery_controller.readAll.bind(gallery_controller));
Index.get('/gallery/:id',gallery_controller.read.bind(gallery_controller));
Index.delete('/gallery/:id',gallery_controller.destroy.bind(gallery_controller));

// START THE SERVER
async function startServer() {
    // START DATABASE
    await sync_database.up()
    // await database_seeder.generateUsers(100)
    Index.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
startServer()
    .then(()=>console.log('successfully started'))
    .catch(e=>console.error(e));

module.exports = Index;
















