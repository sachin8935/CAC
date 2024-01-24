const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../logger");
const dbURL = process.env.DATABASE_URL;
const dbConnect = async() => {
    try {
        if (!dbURL) {
            throw new Error("Missing required environment variable: DATABASE_URL");
        }
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info("Connection with the database was successful");
    } catch (err) {
        logger.error("Connection with the database was not accomplished:", err);
    }
};

module.exports = dbConnect;