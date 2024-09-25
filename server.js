require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());
app.use(express.json());

const model = new ChatGoogleGenerativeAI({
  modelName: 'gemini-1.5-flash',
  maxOutputTokens: 2048,
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    console.log('Received request with messages:', messages);

    // Directly use LangChain's model invocation
    const response = await model.invoke(messages);
    console.log('Response from LangChain:', response);

    res.json({ reply: response.content });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
