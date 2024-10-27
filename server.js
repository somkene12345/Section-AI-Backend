require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://section-ai.vercel.app', 'https://section-ai-backend.vercel.app'],
  optionsSuccessStatus: 200,
}));
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'build')));

// Initialize LangChain model
const model = new ChatGoogleGenerativeAI({
  modelName: 'gemini-1.5-flash',
  maxOutputTokens: 2048,
});

// API route for chatbot
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    console.log('Received request with messages:', messages);

    const response = await model.invoke(messages);
    console.log('Response from LangChain:', response);

    if (response && response.content) {
      res.json({ reply: response.content });
    } else {
      res.status(500).json({ error: 'No valid response from the model.' });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Catch-all route to serve React frontend for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
