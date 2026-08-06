const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { generateLightBurnFile } = require('../utils/lightburn');

module.exports = (io, tickets) => {
  // Get all tickets
  router.get('/tickets', (req, res) => {
    const allTickets = Array.from(tickets.values());
    res.json(allTickets);
  });

  // Get pending tickets
  router.get('/tickets/pending', (req, res) => {
    const pendingTickets = Array.from(tickets.values())
      .filter(t => t.status === 'pending');
    res.json(pendingTickets);
  });

  // Process ticket (scan QR and send to laser)
  router.post('/process-ticket/:id', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const ticket = tickets.get(ticketId);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      if (ticket.status === 'processed') {
        return res.status(400).json({ error: 'Ticket already processed' });
      }

      // Update ticket status
      ticket.status = 'processing';
      tickets.set(ticketId, ticket);
      io.emit('ticket-updated', ticket);

      // Generate LightBurn file
      const outputPath = await generateLightBurnFile(ticket);

      // Update ticket with output path
      ticket.status = 'processed';
      ticket.outputFile = outputPath;
      ticket.processedAt = new Date().toISOString();
      tickets.set(ticketId, ticket);

      // Send to LightBurn (simulated)
      await sendToLightBurn(outputPath, ticket);

      io.emit('ticket-processed', ticket);

      res.json({
        success: true,
        ticket,
        outputFile: outputPath
      });

    } catch (error) {
      console.error('Error processing ticket:', error);
      const ticket = tickets.get(req.params.id);
      if (ticket) {
        ticket.status = 'error';
        ticket.error = error.message;
        tickets.set(req.params.id, ticket);
        io.emit('ticket-error', ticket);
      }
      res.status(500).json({ error: 'Failed to process ticket' });
    }
  });

  // Get ticket details by QR scan
  router.get('/scan/:id', (req, res) => {
    const ticket = tickets.get(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  });

  return router;
};
