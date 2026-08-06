const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs-extra');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));
app.use('/qr-codes', express.static('qr-codes'));

// Ensure directories exist
fs.ensureDirSync('./qr-codes');
fs.ensureDirSync('./tickets');
fs.ensureDirSync('./output');

// Store active tickets
const tickets = new Map();
const activeSessions = new Map();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('register-operator', () => {
    activeSessions.set(socket.id, { role: 'operator', socket });
    console.log('Operator registered');
    // Send pending tickets to operator
    const pendingTickets = Array.from(tickets.values())
      .filter(t => t.status === 'pending');
    socket.emit('pending-tickets', pendingTickets);
  });

  socket.on('register-client', (ticketId) => {
    activeSessions.set(socket.id, { role: 'client', ticketId, socket });
    console.log('Client connected for ticket:', ticketId);
  });

  socket.on('disconnect', () => {
    activeSessions.delete(socket.id);
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/client', require('./routes/client')(io, tickets));
app.use('/api/operator', require('./routes/operator')(io, tickets));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Client URL: http://localhost:${PORT}/client.html`);
  console.log(`Operator URL: http://localhost:${PORT}/operator.html`);
});
