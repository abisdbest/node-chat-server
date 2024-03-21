// Import required modules
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

let messages = [];

// Load messages from file if it exists
if (fs.existsSync('messages.json')) {
  messages = JSON.parse(fs.readFileSync('messages.json'));
}

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
    id: messages.length + 1, // Generate a unique ID for each message
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

// Endpoint to edit a message by ID
app.put('/messages/:id', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  
  const index = messages.findIndex(msg => msg.id == id);
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found.' });
  }

  messages[index].message = message;

  // Save messages to a file
  fs.writeFile('messages.json', JSON.stringify(messages), (err) => {
    if (err) {
      console.error('Error saving messages:', err);
    }
  });

  res.json({ message: 'Message updated successfully.', updatedMessage: messages[index] });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
