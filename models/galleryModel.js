// Import required modules
const Gallery = require('../database/migrations/create_gallery_table');

class GalleryModel {

    // Method to create gallery
    async create(galleryData) {
        try {
            const gallery_data = await Gallery.create(galleryData);
            return gallery_data;

        } catch (e) {
            console.error('Cannot connect to gallery table',e)
        }
    }

    // Method to find all gallery
    async findAll()
    {
        try {
            // Fetch all gallery from the database
            const gallery = await Gallery.findAll();
            return gallery;
        } catch (e) {
            console.error('Cannot connect to gallery table',e)
        }
    }

    // Method to find specific gallery
    async find(id)
    {
        try {
            // Fetch specific gallery from the database
            const gallery = await Gallery.findByPk(id);
            if (!gallery) {
                throw new Error('Gallery not found');
            }
            return gallery;
        } catch (e) {
            console.error('Cannot connect to gallery table',e)
        }
    }

    // Method to delete specific gallery
    async delete(id)
    {
        try {
            // Delete specific gallery from the database
            await Gallery.destroy({ where: { id: id } });
            console.log('Gallery deleted successfully');
        } catch (e) {
            console.error('Cannot connect to gallery table',e)
        }
    }
}

module.exports = GalleryModel;