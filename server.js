const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: 'Generate a single piece of advice for the given category in JSON format with an ID.',
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 30,
  maxOutputTokens: 500, // Reduce tokens to speed up response time
  responseMimeType: 'application/json',
};

app.use(express.static('public')); // Serve static files from 'public' directory
app.use(express.json());

app.get('/advice/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            { text: `Please provide a piece of advice related to the category: ${category}. Format the response as JSON with an ID and advice text.` },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage('Provide advice for the selected category.');
    const advice = JSON.parse(result.response.text());
    if (advice && advice.advice) {
      res.json(advice);
    } else {
      res.status(404).json({ error: 'No advice found for this category.' });
    }
  } catch (error) {
    console.error('Error generating advice:', error);
    res.status(500).json({ error: 'Failed to generate advice' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
