const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use correct model + version
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-002'
});

module.exports = model;
