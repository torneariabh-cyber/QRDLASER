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
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://seu-dominio.com' 
      : '*',
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Ensure directories
fs.ensureDirSync('./qr-codes');
fs.ensureDirSync('./tickets');
fs.ensureDirSync('./output');

// Store tickets
const tickets = new Map();
const activeSessions = new Map();

// Socket.io
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register-operator', () => {
    activeSessions.set(socket.id, { role: 'operator', socket });
    const pendingTickets = Array.from(tickets.values())
      .filter(t => t.status === 'pending');
    socket.emit('pending-tickets', pendingTickets);
  });

  socket.on('register-client', (ticketId) => {
    activeSessions.set(socket.id, { role: 'client', ticketId, socket });
  });

  socket.on('disconnect', () => {
    activeSessions.delete(socket.id);
  });
});

// Routes
app.use('/api/client', require('./routes/client')(io, tickets));
app.use('/api/operator', require('./routes/operator')(io, tickets));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client: http://localhost:${PORT}`);
  console.log(`🔧 Operator: http://localhost:${PORT}/operator`);
});
