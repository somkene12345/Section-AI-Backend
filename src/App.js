import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 
import logo from './logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import * as regularIcons from '@fortawesome/free-regular-svg-icons';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';

const App = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const getIcon = (iconName) => {
    if (icons[iconName]) return icons[iconName];
    if (regularIcons[iconName]) return regularIcons[iconName];
    if (brandIcons[iconName]) return brandIcons[iconName];
    return null;
  };

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
    handleTextSubmit(); // Automatically submit after capturing voice input
  };

  const handleTextSubmit = async () => {
    if (!input) return;
    
    setLoading(true);
    
    // Add user's message to chat history
    setChatHistory((prevHistory) => [...prevHistory, { role: 'user', content: input }]);
    setInput(''); // Clear the input after submission
    
    try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
    messages: chatHistory, // Use the current state value
    });
    
    const aiReply = response.data.reply;
    
    // Add AI's reply to chat history
    setChatHistory((prevHistory) => [
    ...prevHistory,
    { role: 'assistant', content: aiReply },
    ]);
    } catch (error) {
    console.error('Error:', error.message);
    } finally {
    setLoading(false);
    }
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTextSubmit();
  };

  const startVoiceRecognition = () => {
    recognition.start();
  };

  const formatText = (text) => {
    return text.replace(/\n/g, '<br/>');
  };

  return (
    <div className="app-container">
      <header><h1>§ection AI</h1></header>
      <p>
        <p>
        </p>
      </p>
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.role === 'user' ? 'You' : <img src={logo} alt="Logo" className="logo" />}</strong>
            <div dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} className='dv4cm'/>
          </div>
        ))}
      </div>
      <footer>
        <div className="form-container">
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message"
            />
            <button
              type="button"
              className="upload-button"
              onClick={startVoiceRecognition}
            >
              {isListening ? <FontAwesomeIcon icon={getIcon('faVolumeHigh')} /> : <FontAwesomeIcon icon={getIcon('faMicrophone')} />}
            </button>
            <button type="submit" disabled={loading}>
              {loading ? <FontAwesomeIcon icon={getIcon('faEllipsis')} /> : <FontAwesomeIcon icon={getIcon('faArrowUp')} />}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default App;
