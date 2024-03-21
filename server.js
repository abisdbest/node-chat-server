const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

let messages = [];

// Endpoint to get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Endpoint to post a new message
app.post('/messages', (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).json({ error: 'Username and message are required.' });
  }

  const newMessage = {
    username,
    message,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);

  // Save messages to a file
  fs.writeFile('messages.json', JSON.stringify(messages), (err) => {
    if (err) {
      console.error('Error saving messages:', err);
    }
  });

  res.status(201).json({ message: 'Message sent successfully.', newMessage });
});

// Root route handler
app.get('/', (req, res) => {
  res.send('Welcome to the chat server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
