// Import required modules
const GalleryModel = require('../models/galleryModel')
const ImageController = require('./imageController')
const {existsSync, createReadStream, unlinkSync} = require("fs");

class GalleryController {
    constructor() {
        this.galleryModel = new GalleryModel();
        this.imageController = new ImageController();
    }

    // Method to create galleries
    async create(req, res) {
        try {
            const files = req.files; // Array of uploaded files
            if (!files || files.length === 0) {
                return res.status(400).json({error: 'No files uploaded'})
            }
            const galleryItems = [];
            for (const file of files) {
                const imagePath = file.path;
                const imageName = file.originalname;

                // Create a new gallery item for each uploaded file
                const newGalleryItem = this.galleryModel.create({
                    image_name: imageName,
                    file_path: imagePath,
                });
                galleryItems.push(newGalleryItem);

            }
            res.status(200)
                .json({
                    message: 'Files uploaded successfully', galleryItems
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Method to get all gallery
    async readAll(req, res)
    {
        try {
            const gallery = await this.galleryModel.findAll()
            if (!gallery || gallery.length === 0) {
                return res.status(404).json({ error: 'No gallery items found' });
            }
            res.status(200).json({ gallery });
        }catch (e) {
            console.error('Error fetching gallery items:', e);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Method to find specific gallery
    async read(req, res)
    {
        try {
            const { id } = req.params;
            const galleryItem = await this.galleryModel.find(id)
            if (!galleryItem) {
                return res.status(404).json({ error: 'Gallery item not found' });
            }
            const filePath = galleryItem.file_path;
            if (!existsSync(filePath)){
                return res.status(404).json({error: 'Image file not found'})
            }
            const contentType = this.imageController.getContentType(filePath)
            res.setHeader('Content-Type', contentType);

            // Stream the file for download
            const fileStream = createReadStream(filePath)
            fileStream.pipe(res)

        } catch (e) {
            console.error('Error fetching gallery item:', e);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Method to destroy a gallery
    async destroy(req, res)
    {
        try {
            const { id } = req.params;
            const galleryItem = await this.galleryModel.find(id);
            if (!galleryItem) {
                return res.status(404).json({ error: 'Gallery item not found' });
            }
            const filePath = galleryItem.file_path;
            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
            await this.galleryModel.delete(id);
            res.status(200).json({ message: 'Gallery item deleted successfully' });
        }catch (e) {
            console.error('Error deleting file:', e);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }
}

module.exports = GalleryController;