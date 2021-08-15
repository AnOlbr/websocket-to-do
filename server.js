const express = require('express');
const socket = require('socket.io');

const app = express();


const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});
const io = socket(server);

const tasks = [];

io.on('connection', (socket) => {
  io.to(socket.id).emit('updateData', tasks)
  console.log('New client! Its id – ' + socket.id);

  socket.on('addTask', ({id, name}) => {
    tasks.push({id, name});
    console.log('Add new task: ', {id, name})
    socket.broadcast.emit('addTask', {id, name});
  });

  socket.on('removeTask', (deleteTask) => {
    tasks.splice(deleteTask, 1);
    console.log('Remove task id: ', deleteTask);
    socket.broadcast.emit('removeTask', deleteTask);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});