const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

module.exports = (io, tickets) => {
  // Create new ticket from client
  router.post('/create-ticket', async (req, res) => {
    try {
      const { name, font, icon } = req.body;
      const ticketId = uuidv4();
      const qrCodePath = path.join(__dirname, '../../qr-codes', `${ticketId}.png`);
      
      // Generate QR Code for the ticket
      const ticketData = JSON.stringify({
        id: ticketId,
        name,
        font,
        icon: icon || null,
        timestamp: new Date().toISOString()
      });

      await QRCode.toFile(qrCodePath, ticketData, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 300
      });

      // Create ticket object
      const ticket = {
        id: ticketId,
        name,
        font,
        icon: icon || null,
        status: 'pending',
        qrCode: `/qr-codes/${ticketId}.png`,
        createdAt: new Date().toISOString(),
        qrData: ticketData
      };

      tickets.set(ticketId, ticket);

      // Notify operators about new ticket
      io.emit('new-ticket', ticket);

      res.json({
        success: true,
        ticketId,
        qrCode: `/qr-codes/${ticketId}.png`,
        ticket
      });

    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  });

  // Get ticket status
  router.get('/ticket/:id', (req, res) => {
    const ticket = tickets.get(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  });

  return router;
};
