const model = require('./geminiClient')

async function analyzeJournalSentiment(text) {
    const prompt = `Analyze the sentiment (Positive, Negative, or Neutral) of the following journal entry and explain briefly:\n"${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

module.exports =  analyzeJournalSentiment ;
