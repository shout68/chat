const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Массив для хранения подключенных клиентов
let clients = [];

io.on('connection', (socket) => {
  console.log('Новое соединение установлено');

  // Добавляем клиента в массив
  clients.push(socket);

  // Обработка входящих сообщений от клиентов
  socket.on('message', (message) => {
    // Отправляем сообщение всем клиентам, кроме отправителя
    clients.forEach(client => {
      if (client !== socket) {
        client.emit('message', message);
      }
    });
  });

  // Обработка отключения клиента
  socket.on('disconnect', () => {
    console.log('Соединение закрыто');
    // Удаляем клиента из массива
    clients = clients.filter(client => client !== socket);
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});