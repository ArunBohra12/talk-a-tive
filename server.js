const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
require('colors');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.json());
dotenv.config();

app.use(cors());
app.options('*', cors());

connectDB();

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/message', messageRoutes);

// To deploy on heroku
// This block of code has to be here, at last in routes middleware stack
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Listening to requests on port ${port}`.yellow.bold));

// Socket IO connection
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: { origin: '*' },
});

io.on('connection', socket => {
  socket.on('setup', userData => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', room => socket.join(room));

  socket.on('new message', newMessageReceived => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log('Chat.users not defined');

    chat.users.forEach(user => {
      if (user._id == newMessageReceived.sender._id) return console.log('You can not send yourself messages');

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  socket.on('typing', room => socket.in(room).emit('typing'));
  socket.on('stop typing', room => socket.in(room).emit('stop typing'));

  socket.off('setup', () => socket.leave(userData._id));
});
