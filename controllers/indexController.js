class IndexController {
    async test(req, res) {
        res.json({message: 'Server is Working Properly'});
    }

    async error(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send("Something went Wrong");
    }
}

module.exports = IndexController;