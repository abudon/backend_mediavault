// Import requirements
require('dotenv').config({path:'../.env'})
const ImageModel = require("../models/imageModel")
const {join, extname} = require("path");
const {existsSync, createReadStream} = require("fs");

class ImageController{
    // Variables
    constructor(){
        this.server_url = process.env.SERVER_URL;
        this.imageModel = new ImageModel();
        this.getContentType = (filePath) => {
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
                case '.avi':
                    return 'video/avi';
                case '.mkv':
                    return 'video/mkv';
                case '.mov':
                    return 'video/quicktime'

                // Add more cases for other image and video file types if needed
                default:
                    return 'application/octet-stream'; // Default to binary data if a file type is not recognized
            }
        };
    }
    // Functions


    // Method to upload user image
    async create(req, res)
    {
        try {
            const user_id = req.params.user_id;
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
            const uploadedFiles = [];
            for (const file of req.files) {
                const filePath = join(__dirname, 'uploads', file.filename); // Get the file path of the uploaded file
                const imagePath = file.path;
                const imageName = file.originalname;

                const imageProps = {
                    image_name: imageName,
                    file_path: imagePath,
                    user_id: user_id
                }
                // Save the image data in the database
                const image = await this.imageModel.create(imageProps)
                uploadedFiles.push(image);
                res.status(200)
                    .json(
                        {
                            message: 'Files uploaded successfully',
                            images: uploadedFiles
                        }
                        );
            }

        }catch (e) {
            console.error('Error uploading file:', e);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    // Method to get user's images'
    async read(req, res)
    {
        try {
            const user_id = req.params.user_id;
            const images = await this.imageModel.findAll(user_id)
            if (!images || images.length === 0) {
                return res.status(404).json({ error: 'No images found for this user' });
            }
            res.status(200).json({ images });
        } catch (e) {
            console.error('Error fetching images:', e);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    // Method to delete user's image'
    async destroy(req, res)
    {
        try {
            const image_id = req.params.imageId;
            const image = await this.imageModel.delete(image_id)
            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }
            res.status(200)
                .json(
                    {
                        message: 'Image deleted successfully'
                    }
                    );
        } catch (e) {
            console.error('Error deleting image:', e);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    // Method to download single user's image'
    async download(req, res)
    {
        try {
            const { user_id, image_id } = req.params;
            const image = await this.imageModel.findById(image_id,user_id)
            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }

            // checking the file path on the server
            const file_path = image.file_path
            if (!existsSync(file_path)){
                return res.status(404).json({error: 'Image Path file not found in server'})
            }
            // Determine the content type based on the file extension
            const contentType = this.getContentType(file_path);
            // Set the Content-Type header
            res.setHeader('Content-Type', contentType);
            const fileStream = createReadStream(file_path)
            fileStream.pipe(res);


        } catch (e) {
            console.error('Error downloading image:', e);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    // Method to download all user's image'
    async downloadAll(req, res)
    {
        try {
            const user_id = req.params.user_id;
            const images = await this.imageModel.findAll(user_id)
            if (!images || images.length === 0) {
                return res.status(404).json({ error: 'No images found for this user' });
            }
            // Generate download links for each image
            const downloadLinks = images.map(image => ({
                filename: image.image_name,
                url: `${this.server_url}/api/images/download/${user_id}/${image.id}`
            }));
            res.status(200)
                .json(downloadLinks);
        } catch (e) {
            console.error('Error downloading all images:', e);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}

module.exports = ImageController;