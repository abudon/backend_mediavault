const notificationsModel = require("../models/notificationsModel")

class NotificationController {
    constructor() {
        this.notifications = new notificationsModel();
    }

    async create(req, res)
    {
        try
        {
            const { userId, message } = req.body;
            const newNotification = await this.notifications.create({
             user_id:userId,
              messages:message
            });
            res.status(201).json(newNotification);
        }
        catch (error)
        {
            res.status(500).json({ error: error.message });
        }
    }

    // Method to get notifications for a specific users
    async read(req, res)
    {
        try
        {
            const { userId } = req.params;
            const notifications = await this.notifications.findAll(userId)
            res.status(200).json(notifications);
        }
        catch (error)
        {
            res.status(500).json({ error: error.message });
        }
    }

}
module.exports = NotificationController;