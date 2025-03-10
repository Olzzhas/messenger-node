const express = require('express');
const { mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./router');
const chatRoute = require('./routes/chatRoute');
const storageRoute = require('./routes/google-storage-routes');
const errorMiddleware = require('./middlewares/error-middleware');
const app = new express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

//test
const io = new Server(server, {
   cors: {
      origin: 'https://frabjous-meringue-2aca4f.netlify.app',
      // origin: 'http://localhost:3000',
   },
});

require('dotenv').config();

const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/user', router);
app.use('/chat', chatRoute);
app.use('/storage', storageRoute);

app.use(errorMiddleware);

mongoose.set('strictQuery', false);

let onlineUsers = [];

io.on('connection', (socket) => {
   console.log('new connection', socket.id);

   // listen to a connection
   socket.on('addNewUser', (userId) => {
      !onlineUsers.some((user) => user.userId === userId) &&
         onlineUsers.push({
            userId,
            socketId: socket.id,
         });

      console.log('onlineUsers', onlineUsers);

      io.emit('getOnlineUsers', onlineUsers);
   });

   socket.on('sendMessage', (message) => {
      const user = onlineUsers.find(
         (user) => user.userId === message.recipientId,
      );

      if (user) {
         io.to(user.socketId).emit('getMessage', message);
      }
   });

   socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      io.emit('getOnlineUsers', onlineUsers);
   });
});

const start = async () => {
   try {
      await mongoose.connect(process.env.mongoUrl).then(() => {
         console.log('Mongo connected...');
      });

      await server.listen(process.env.PORT, (err) => {
         if (err != null) {
            console.log(err);
         } else {
            console.log(`Server started on port ${process.env.PORT}...`);
         }
      });
   } catch (error) {
      console.log(error);
   }
};

start();
