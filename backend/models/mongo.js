// models/mongo.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mind');
        console.log("✅ MongoDB connected via Mongoose");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
};

module.exports = connectDB;
