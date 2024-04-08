const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import CORS middleware
const e = require('express');
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

app.post('/checkpassword', (req, res) => {
  const { password } = req.body;
  console.log("thingied")
  if (password == "aaa") {
    res.status(200).json({ passcorrect: true });  
  }
  else {
    res.status(200).json({ passcorrect: false })
  }
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

app.post('/deletemessage', async (req, res) => {
  const { otheruser, othermessage, password } = req.body;
  console.log("deleting message: ", req.body);
  if (!otheruser || !othermessage || !password) {
    return res.status(400).json({ error: "you didn't send enough parameters with the request!" });
  } else if (password !== "aaa") {
    return res.status(403).json({ error: "access denied. the password is wrong" });
  } else {
    try {
      var resp = await fetch(
        "https://blooket1-chat-server.onrender.com/messages#classroom.google.com"
      );
      vals = await resp.json()
      for (let i = 0; i < vals.length; i++) {
        if (vals[i].username === otheruser && vals[i].message === othermessage) {
          index = messages.indexOf(i)
          messages.splice(index, 1);
          console.log("message deleted")
          return res.status(200).json({ deleted: true, messages });
        }
      }

      console.log(`message not found, ${messages}`)
      return res.status(404).json({ deleted: false, error: "message not found (but how?) try reloading" });
    } catch (e) {
      console.log("error: "+e)
      return res.status(500).json({ deleted: false, error: e });
    }
  }
});

app.post('/editmessage', async (req, res) => {
  const { otheruser, othermessage, editedmsg, password } = req.body;
  console.log("editing message: ", req.body);
  if (!otheruser || !othermessage || !editedmsg || !password) {
    return res.status(400).json({ error: "you didn't send enough parameters with the request!" });
  } else if (password !== "aaa") {
    return res.status(403).json({ error: "access denied. the password is wrong" });
  } else {
    try {
      var resp = await fetch(
        "https://blooket1-chat-server.onrender.com/messages#classroom.google.com"
      );
      vals = await resp.json()
      for (let i = 0; i < vals.length; i++) {
        if (vals[i].username === otheruser && vals[i].message === othermessage) {
          index = messages.indexOf(i)
          messages[i].message = editedmsg
          console.log("message edited")
          return res.status(200).json({ edited: true, messages });
        }
      }

      console.log(`message not found, ${messages}`)
      return res.status(404).json({ edited: false, error: "message not found (but how?) try reloading" });
    } catch (e) {
      console.log("error: "+e)
      return res.status(500).json({ edited: false, error: e });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});