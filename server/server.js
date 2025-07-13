const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// store online users and typing users
const users = {};
const typingUsers = {};

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // handle user join
  socket.on('user_join', (username) => {
    users[socket.id] = username;

    console.log(`${username} joined as ${socket.id}`);

    io.emit('user_list', Object.values(users)); // send updated user list
    io.emit('user_joined', { username, id: socket.id });
  });

  // handle message
  socket.on('send_message', ({ message }) => {
    const sender = users[socket.id] || 'Anonymous';
    const msgData = {
      id: Date.now(),
      sender,
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString()
    };

    io.emit('receive_message', msgData);
  });

  // handle typing
  socket.on('typing', (isTyping) => {
    const username = users[socket.id];
    if (!username) return;

    if (isTyping) {
      typingUsers[socket.id] = username;
    } else {
      delete typingUsers[socket.id];
    }

    io.emit('typing_users', Object.values(typingUsers));
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      console.log(`${username} left`);
      delete users[socket.id];
      delete typingUsers[socket.id];

      io.emit('user_list', Object.values(users)); // update user list
      io.emit('user_left', { username, id: socket.id });
      io.emit('typing_users', Object.values(typingUsers));
    }
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
