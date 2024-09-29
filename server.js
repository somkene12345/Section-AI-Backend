require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Adjust this if you're hosting frontend separately
app.use(express.json());

// Initialize LangChain Model
const model = new ChatGoogleGenerativeAI({
  modelName: 'gemini-1.5-flash',
  maxOutputTokens: 2048,
});

// Handle chat requests
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    console.log('Received request with messages:', messages);

    // Invoke the model using LangChain
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

// Serve static frontend files if frontend is deployed on the same server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

const corsOptions = {
  origin: ['http://localhost:3000', 'https://section-ai.vercel.app'], // Allow your frontend domains
  methods: 'GET,POST', // Methods you want to allow
  allowedHeaders: 'Content-Type', // Headers you want to allow
  credentials: true, // Set to true if your frontend needs cookies or credentials from the backend
};

// Use the configured CORS middleware
app.use(cors(corsOptions));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
