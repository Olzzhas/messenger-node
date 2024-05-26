const express = require('express');
const { mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./router');
const chatRoute = require('./routes/chatRoute');
const errorMiddleware = require('./middlewares/error-middleware');
const app = new express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
   cors: {
      origin: 'http://localhost:3000',
   },
});

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/user', router);
app.use('/chat', chatRoute);

app.use(errorMiddleware);

mongoose.set('strictQuery', false);

io.on('connection', (socket) => {
   console.log('A user connected');

   socket.on('send_message', (data) => {
      socket.broadcast.emit('receive_message', data);
   });

   socket.on('disconnect', () => {
      console.log('User disconnected');
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
