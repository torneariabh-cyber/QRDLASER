class OperatorApp {
    constructor() {
        this.socket = io();
        this.tickets = [];
        this.codeReader = null;
        this.scannerActive = false;
        
        this.elements = {
            totalTickets: document.getElementById('totalTickets'),
            pendingTickets: document.getElementById('pendingTickets'),
            processedTickets: document.getElementById('processedTickets'),
            ticketsList: document.getElementById('ticketsList'),
            scanInput: document.getElementById('scanInput'),
            scanButton: document.getElementById('scanButton'),
            startScanner: document.getElementById('startScanner'),
            stopScanner: document.getElementById('stopScanner'),
            qrScanner: document.getElementById('qrScanner')
        };

        this.setupEventListeners();
        this.setupSocketListeners();
        this.loadTickets();
        this.registerAsOperator();
    }

    setupEventListeners() {
        this.elements.scanButton.addEventListener('click', () => {
            const ticketId = this.elements.scanInput.value.trim();
            if (ticketId) {
                this.processTicket(ticketId);
            }
        });

        this.elements.scanInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.elements.scanButton.click();
            }
        });

        this.elements.startScanner.addEventListener('click', () => {
            this.startQRScanner();
        });

        this.elements.stopScanner.addEventListener('click', () => {
            this.stopQRScanner();
        });
    }

    setupSocketListeners() {
        this.socket.on('new-ticket', (ticket) => {
            this.addTicket(ticket);
            this.updateStats();
            this.showNotification('Novo ticket recebido!');
        });

        this.socket.on('ticket-updated', (ticket) => {
            this.updateTicket(ticket);
            this.updateStats();
        });

        this.socket.on('ticket-processed', (ticket) => {
            this.updateTicket(ticket);
            this.updateStats();
            this.showNotification(`Ticket ${ticket.id} processado com sucesso!`);
        });

        this.socket.on('ticket-error', (ticket) => {
            this.updateTicket(ticket);
            this.updateStats();
            this.showNotification(`Erro ao processar ticket ${ticket.id}`, 'error');
        });

        this.socket.on('pending-tickets', (tickets) => {
            tickets.forEach(ticket => this.addTicket(ticket));
            this.updateStats();
        });
    }

    async loadTickets() {
        try {
            const response = await fetch('/api/operator/tickets');
            const tickets = await response.json();
            tickets.forEach(ticket => this.addTicket(ticket));
            this.updateStats();
        } catch (error) {
            console.error('Error loading tickets:', error);
        }
    }

    registerAsOperator() {
        this.socket.emit('register-operator');
    }

    addTicket(ticket) {
        const existing = this.tickets.find(t => t.id === ticket.id);
        if (!existing) {
            this.tickets.push(ticket);
            this.renderTickets();
        }
    }

    updateTicket(updatedTicket) {
        const index = this.tickets.findIndex(t => t.id === updatedTicket.id);
        if (index !== -1) {
            this.tickets[index] = updatedTicket;
            this.renderTickets();
        }
    }

    renderTickets() {
        if (this.tickets.length === 0) {
            this.elements.ticketsList.innerHTML = '<p class="no-tickets">Nenhum ticket disponível</p>';
            return;
        }

        const sortedTickets = [...this.tickets].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        this.elements.ticketsList.innerHTML = sortedTickets.map(ticket => `
            <div class="ticket-card status-${ticket.status}">
                <div class="ticket-header">
                    <span class="ticket-id">#${ticket.id.slice(0, 8)}</span>
                    <span class="ticket-status">${this.getStatusLabel(ticket.status)}</span>
                </div>
                <div class="ticket-body">
                    <p><strong>Nome:</strong> ${ticket.name}</p>
                    <p><strong>Fonte:</strong> ${ticket.font}</p>
                    ${ticket.icon ? `<p><strong>Ícone:</strong> ${ticket.icon}</p>` : ''}
                    <p><strong>Criado:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
                    ${ticket.processedAt ? `<p><strong>Processado:</strong> ${new Date(ticket.processedAt).toLocaleString()}</p>` : ''}
                </div>
                ${ticket.status === 'pending' ? `
                    <div class="ticket-actions">
                        <button class="btn-secondary" onclick="app.processTicket('${ticket.id}')">
                            Processar
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    getStatusLabel(status) {
        const labels = {
            'pending': '⏳ Pendente',
            'processing': '🔄 Processando',
            'processed': '✅ Processado',
            'error': '❌ Erro'
        };
        return labels[status] || status;
    }

    async processTicket(ticketId) {
        try {
            this.elements.scanInput.value = ticketId;
            const response = await fetch(`/api/operator/process-ticket/${ticketId}`, {
                method: 'POST'
            });

            const data = await response.json();
            if (!data.success) {
                this.showNotification('Erro ao processar ticket: ' + (data.error || 'Tente novamente'), 'error');
            }
        } catch (error) {
            console.error('Error processing ticket:', error);
            this.showNotification('Erro ao processar ticket', 'error');
        }
    }

    updateStats() {
        const total = this.tickets.length;
        const pending = this.tickets.filter(t => t.status === 'pending').length;
        const processed = this.tickets.filter(t => t.status === 'processed').length;

        this.elements.totalTickets.textContent = total;
        this.elements.pendingTickets.textContent = pending;
        this.elements.processedTickets.textContent = processed;
    }

    async startQRScanner() {
        try {
            this.codeReader = new ZXing.BrowserQRCodeReader();
            const video = this.elements.qrScanner;
            
            // Get camera permission
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            video.srcObject = stream;
            await video.play();

            this.elements.startScanner.style.display = 'none';
            this.elements.stopScanner.style.display = 'inline-block';
            this.scannerActive = true;

            this.decodeQR();
        } catch (error) {
            console.error('Error starting QR scanner:', error);
            this.showNotification('Erro ao iniciar scanner. Verifique a câmera.', 'error');
        }
    }

    async decodeQR() {
        if (!this.scannerActive) return;

        try {
            const result = await this.codeReader.decodeOnceFromVideoDevice(undefined, this.elements.qrScanner);
            this.handleQRResult(result.text);
        } catch (error) {
            // Continue scanning if no QR found
            if (this.scannerActive) {
                setTimeout(() => this.decodeQR(), 100);
            }
        }
    }

    handleQRResult(data) {
        try {
            const ticketData = JSON.parse(data);
            if (ticketData.id) {
                this.elements.scanInput.value = ticketData.id;
                this.processTicket(ticketData.id);
                this.stopQRScanner();
                this.showNotification('QR Code detectado! Processando ticket...');
            }
        } catch (error) {
            console.error('Invalid QR data:', error);
            this.showNotification('QR Code inválido', 'error');
        }
    }

    stopQRScanner() {
        this.scannerActive = false;
        this.elements.startScanner.style.display = 'inline-block';
        this.elements.stopScanner.style.display = 'none';
        
        const video = this.elements.qrScanner;
        if (video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }

        if (this.codeReader) {
            this.codeReader.reset();
            this.codeReader = null;
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new OperatorApp();
});

// Make processTicket available globally for onclick handlers
window.processTicket = (ticketId) => {
    if (app) app.processTicket(ticketId);
};
