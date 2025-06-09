const {GoogleGenerativeAI} = require('@google/generative-ai')
require('dotenv').config()

const genAI = new GoogleGenerativeAI(process.env.Gemini_key);
const model = genAI.getGenerativeModel({model:'gemini-pro'})
//console.log(process.env.Gemini_key);

module.exports = model