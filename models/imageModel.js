// Import Requirements
const Image = require('../database/migrations/create_image_table')

class ImageModel {


    // Method for creating image
    async create(props)
    {
        try {
            const image = await Image.create(props)
            if (image){
                console.log('Image Successfully Created')
                return image
            }else {
                console.error('Error Creating Image:')
                return null
            }
        }catch (e) {
            console.log('Error From Database',e)
        }

    }

    // Method for fetching image
    async findAll(id)
    {
        try {
            const images = await Image.findAll({
                where: { user_id: id }
            })
            if (images.length > 0){
                console.log('Images Successfully fetched')
                return images
            }else {
                console.error('Error Fetching Images:')
                return null
            }
        }catch (e) {
            console.error("Cannot Fetch Images From Database",e)
        }

    }

    // Method for deleting image
    async delete(id)
    {
        try {
            const image = await Image.findByPk(id)
            if (image){
                await image.destroy()
                console.log('Image Successfully Deleted')
                return true
            } else {
                console.error('Error Deleting Image:')
                return false
            }
        }catch (e) {
            console.error('Error Deleting Image From Database',e)
        }
    }

    // Method for getting particular image for a particular user
    async findById(id, userId)
    {
        try {
            const image = await Image.findOne({
                where: { id: id, user_id: userId }
            })
            if (image){
                console.log('Image Successfully fetched')
                return image
            } else {
                console.error('Error Fetching Image:')
                return null
            }
        }catch (e) {
            console.error('Error Fetching Image From Database',e)
        }
    }

}

module.exports = ImageModel;