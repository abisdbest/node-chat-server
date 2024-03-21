const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Array to store messages
let messages = [];

// Serve static files from the public directory
app.use(express.static('public'));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send all messages to the connected client
  socket.emit('messages', messages);

  // Handle new messages
  socket.on('newMessage', (data) => {
    const message = {
      username: data.username,
      text: data.text,
      timestamp: new Date()
    };

    // Add the new message to the array
    messages.push(message);

    // Broadcast the new message to all connected clients
    io.emit('newMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
