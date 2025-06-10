require('dotenv').config();
const model = require('./geminiClient');

async function analyzeJournalSentiment(text) {
    const prompt = `Analyze the sentiment (Positive, Negative, or Neutral) of the following journal entry and explain briefly:\n"${text}"`;
    console.log(prompt);

    
    try {
        const result = await model.generateContent([prompt]); // ✅ Corrected
        const response = await result.response;
        return response.text();
    } catch (err) {
        console.error('❌ Error in analyzeJournalSentiment:', err.message);
        return 'Error analyzing sentiment.';
    }
}

module.exports = analyzeJournalSentiment;
