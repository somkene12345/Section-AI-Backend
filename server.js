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

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

// Create the uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

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

// Route for handling image uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  console.log('Received file:', filePath);

  try {
    // Implement image processing or detection here
    // For example, you might send the image to an image analysis API or use a library
    
    // Example (pseudo-code, replace with actual processing):
    // const imageAnalysisResult = await analyzeImage(filePath);

    res.json({ message: 'Image uploaded successfully', filePath });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'An error occurred while processing the image.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
