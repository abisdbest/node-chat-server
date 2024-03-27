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

let userIDs = [];

let blockedUserIDs = new Set(); // Store blocked user IDs

// POST endpoint to block a user
app.post('/blockuser', (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ error: 'UserID is required.' });
    }

    // Block the user by adding their ID to the set
    blockedUserIDs.add(userID);

    // Respond with the updated list of blocked user IDs
    res.status(201).json({ message: 'User blocked successfully.', blockedUserIDs: Array.from(blockedUserIDs) });
});

// GET endpoint for blocked user IDs
app.get('/blockedusers', (req, res) => {
    res.status(200).json({ blockedUserIDs: Array.from(blockedUserIDs) });
});

// Middleware to check if a user is blocked
app.use((req, res, next) => {
    const { userid } = req.body;
    if (blockedUserIDs.has(userid)) {
        return res.status(403).json({ error: 'Access denied. User is blocked.' });
    }
    next();
});


app.post('/userid', (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    return res.status(400).json({ error: 'UserID is required.' });
  }

  // Save the userID (you can customize this logic)
  userIDs.push(userID);

  // Respond with the updated list of user IDs
  res.status(201).json({ message: 'UserID saved successfully.', userIDs });
});

// GET endpoint for /userid
app.get('/userid', (req, res) => {
  // Respond with the current list of user IDs
  res.status(200).json({ userIDs });
});

// Endpoint to get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// || !ipaddr
// Endpoint to post a new message
app.post('/messages', (req, res) => {
  const { username, message, userid } = req.body;
  if (!username || !message || !userid) {
    return res.status(400).json({ error: 'Username, userID and message are required.' });
  }

  const newMessage = {
    username,
    message,
    userid
    // timestamp: new Date().toISOString()
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
