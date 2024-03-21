const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let messages = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).json({ error: 'Username and message are required.' });
  }

  const newMessage = {
    id: messages.length + 1,
    username,
    message,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);

  fs.writeFile('messages.json', JSON.stringify(messages), (err) => {
    if (err) {
      console.error('Error saving messages:', err);
    }
  });

  res.status(201).json({ message: 'Message sent successfully.', newMessage });
});

app.put('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const { message } = req.body;

  const index = messages.findIndex(msg => msg.id === messageId);
  if (index !== -1) {
    messages[index].message = message;
    fs.writeFile('messages.json', JSON.stringify(messages), (err) => {
      if (err) {
        console.error('Error saving messages:', err);
      }
    });
    res.json({ message: 'Message updated successfully.', updatedMessage: messages[index] });
  } else {
    res.status(404).json({ error: 'Message not found.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Load messages from file on server start
fs.readFile('messages.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading messages file:', err);
  } else {
    messages = JSON.parse(data);
  }
});
