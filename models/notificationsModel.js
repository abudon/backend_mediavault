const Notifications = require('../database/migrations/create_notifications_table')


class NotificationsModel {

    // Method to create a user's notification
    async create(notificationData)
    {
        try {
            // Create a new notification in the database
            const notification = await Notifications.create(notificationData);

            console.log('Notification created:', notification.toJSON());
            return notification; // Return the created notification object
        } catch (e) {
            console.error('Something went wrong on the database',e)
        }
    }

    // Method to get all notifications for a specific user
    async findAll(userId)
    {
        try {
            // Query the database to fetch all notifications for the specified user
            const notifications = await Notifications.findAll({where: {user_id: userId}});

            console.log('Notifications fetched:', notifications.map(notification => notification.toJSON()));
            return notifications; // Return the fetched notifications array
        } catch (e) {
            console.error('Something went wrong on the database',e)
        }
    }

}

module.exports = NotificationsModel;