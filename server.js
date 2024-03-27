const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import CORS middleware
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

let messages = [];

// Endpoint to get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// || !ipaddr
// Endpoint to post a new message
app.post('/messages', (req, res) => {
  const { username, message, ipaddr } = req.body;
  if (!username || !message ) {
    return res.status(400).json({ error: 'Username, IP and message are required.' });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
